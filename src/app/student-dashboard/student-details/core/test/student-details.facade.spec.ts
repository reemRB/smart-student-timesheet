import { StudentDetailsResponse } from '../../../core/student';
import {
  CellKey,
  dayName,
  hourLabel,
} from '../student-details-helper-functions';
import { StudentDetailsFacade } from '../student-details.facade';
import {
  MockStudentFacade,
  localDate,
  makeSessionId,
} from './student-details.facade.utility.spec';

describe('StudentDetailsFacade (active & next, weekly semantics)', () => {
  let mockStudent: MockStudentFacade;
  let facade: StudentDetailsFacade;

  beforeEach(() => {
    mockStudent = new MockStudentFacade();
    facade = new StudentDetailsFacade({ studentFacade: mockStudent as any });
  });

  it('sets ACTIVE when decrypted timestamp falls inside class interval (weekly, ignore real date)', () => {
    // Class: Wednesday 10:00–11:00 (any calendar date)
    const classStart = localDate(2025, 8, 3, 10, 0); // Wed Sep 3, 2025 10:00
    // "Now" is any Wednesday 10:30 on a different date
    const nowInside = localDate(2024, 0, 10, 10, 30); // Wed Jan 10, 2024 10:30

    const resp: StudentDetailsResponse = {
      data: {
        firstName: 'Ada',
        lastName: 'Ercan',
        studentId: '12345',
        email: 'ada.ercan@example.com',
        address: 'Somewhere',
        number: '555-0000',
        sessionID: `${makeSessionId(nowInside.getTime(), '12345')}`,
        classes: [
          {
            className: 'Algorithms',
            classTimestamp: String(classStart.getTime()),
            duration: 60,
            roomNumber: 'R1',
          },
        ],
      },
    };

    mockStudent.studentDetails$.next(resp);
    const map = new Map<CellKey, any>();
    facade.setClassBlock(map);

    const day = dayName(classStart); // "Wednesday"
    const hour = hourLabel(classStart); // "10:00 AM"

    expect(facade.isActiveClass(day, hour)).toBeTrue();
    // Since active is found, next should not be flagged for that same cell
    expect(facade.isNextClass(day, hour)).toBeFalse();
  });

  it('when no active class, NEXT is the closest future class in weekly rotation', () => {
    // Classes: Monday 09:00, Thursday 15:00
    const mon0900 = localDate(2025, 8, 1, 9, 0);
    const thu1500 = localDate(2025, 8, 4, 15, 0);
    // Now: Monday 08:00 -> next should be Monday 09:00
    const now = localDate(2024, 0, 1, 8, 0); // Monday 08:00 (different date)

    const resp: StudentDetailsResponse = {
      data: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        studentId: '12345',
        email: 'ada@example.com',
        address: 'Somewhere',
        number: '555-0000',
        sessionID: makeSessionId(now.getTime(), '12345'),
        classes: [
          {
            className: 'Math',
            classTimestamp: String(mon0900.getTime()),
            duration: 60,
            roomNumber: 'R2',
          },
          {
            className: 'Physics',
            classTimestamp: String(thu1500.getTime()),
            duration: 60,
            roomNumber: 'R3',
          },
        ],
      },
    };

    mockStudent.studentDetails$.next(resp);
    const map = new Map<CellKey, any>();
    facade.setClassBlock(map);

    expect(
      facade.isActiveClass(dayName(mon0900), hourLabel(mon0900)),
    ).toBeFalse();
    expect(
      facade.isActiveClass(dayName(thu1500), hourLabel(thu1500)),
    ).toBeFalse();

    expect(facade.isNextClass(dayName(mon0900), hourLabel(mon0900))).toBeTrue();
    expect(
      facade.isNextClass(dayName(thu1500), hourLabel(thu1500)),
    ).toBeFalse();
  });

  it('sets next class even if it is next week: if NOW is Friday 18:00 and class is Monday 09:00, NEXT is Monday 09:00', () => {
    const mon0900 = localDate(2025, 8, 1, 9, 0);
    const fri1800 = localDate(2025, 8, 5, 18, 0); // NOW

    const resp: StudentDetailsResponse = {
      data: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        studentId: '12345',
        email: 'ada@example.com',
        address: 'Somewhere',
        number: '555-0000',
        sessionID: makeSessionId(fri1800.getTime(), '12345'),
        classes: [
          {
            className: 'Chemistry',
            classTimestamp: String(mon0900.getTime()),
            duration: 60,
            roomNumber: 'R9',
          },
        ],
      },
    };

    mockStudent.studentDetails$.next(resp);
    const map = new Map<CellKey, any>();
    facade.setClassBlock(map);

    // Not active on Friday 18:00
    expect(
      facade.isActiveClass(dayName(mon0900), hourLabel(mon0900)),
    ).toBeFalse();
    // Next should be Monday 09:00
    expect(facade.isNextClass(dayName(mon0900), hourLabel(mon0900))).toBeTrue();
  });

  it('handles absence of classes: neither active nor next is set', () => {
    const now = localDate(2025, 8, 1, 9, 0);
    const resp: StudentDetailsResponse = {
      data: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        studentId: '12345',
        email: 'ada@example.com',
        address: 'Somewhere',
        number: '555-0000',
        sessionID: makeSessionId(now.getTime(), '12345'),
        classes: [],
      },
    };

    mockStudent.studentDetails$.next(resp);
    const map = new Map<CellKey, any>();
    facade.setClassBlock(map);

    // Try a few sample cells — all should be false
    const samples: Array<[string, string]> = [
      ['Monday', '9:00 AM'],
      ['Wednesday', '1:00 PM'],
      ['Friday', '3:00 PM'],
    ];
    samples.forEach(([day, hour]) => {
      expect(facade.isActiveClass(day, hour)).toBeFalse();
      expect(facade.isNextClass(day, hour)).toBeFalse();
    });
  });
});
