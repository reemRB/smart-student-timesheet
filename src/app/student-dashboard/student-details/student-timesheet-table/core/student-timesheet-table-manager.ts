// features/student-details/core/student-details.facade.ts
import { IStudentFacade } from '../../../core/student.facade';
import { map, take } from 'rxjs/operators';
import { StudentDetailsResponse } from '../../../core/student';

import {
  cellKey,
  CellKey,
  ClassBlock,
  dayName,
  hourLabel,
} from './student-timesheet-table-helper-functions';

interface StudentTimesheetTableDependencies {
  studentFacade: IStudentFacade;
}

interface IStudentTimesheetTableManager {
  setClassBlock(map: Map<CellKey, ClassBlock>): void;
  getClassBlock(
    map: Map<CellKey, ClassBlock>,
    day: string,
    time: string,
  ): ClassBlock | undefined;

  isActiveClass(day: string, time: string): boolean;

  isNextClass(day: string, time: string): boolean;

  getCurrentDay(): string | null;
}

export class StudentTimesheetTableManager
  implements IStudentTimesheetTableManager
{
  private readonly secretKey = 'secretKey';
  private studentDetails: StudentDetailsResponse | undefined;
  private activeCellKey: CellKey | null = null;
  private nextActiveCellKey: CellKey | null = null;

  constructor(private dependencies: StudentTimesheetTableDependencies) {
    this.dependencies.studentFacade.studentDetails$
      .pipe(
        take(1),
        map((details) => {
          this.studentDetails = details;
        }),
      )
      .subscribe();
  }

  public setClassBlock(map: Map<CellKey, ClassBlock>) {
    if (!this.studentDetails) return;
    map.clear();
    for (const classData of this.studentDetails.data.classes) {
      const classTime = new Date(Number(classData.classTimestamp));
      const durationMin = classData.duration ?? 60;

      const day = dayName(classTime);
      const hour = hourLabel(classTime);

      // Positioning info
      const topPositionPercentage = (classTime.getMinutes() / 60) * 100;
      const heightPercentage = (durationMin / 60) * 100;

      const key = `${day}|${hour}` as CellKey;

      const block: ClassBlock = {
        className: classData.className,
        roomNumber: classData.roomNumber,
        durationMin,
        topPositionPercentage,
        heightPercentage,
      };
      map.set(key, block);
    }
    this.computeActiveAndNextActiveCellKey();
  }

  private decryptSessionID(resp?: StudentDetailsResponse) {
    const sessionID = resp?.data?.sessionID;
    if (!sessionID) throw new Error('No sessionID found');

    const [encryptedTimestamp, studentId] = sessionID.split('.');

    const timestamp = atob(encryptedTimestamp);

    return { timestamp, studentId };
  }

  public isActiveClass(day: string, time: string): boolean {
    if (!this.activeCellKey) return false;
    return this.activeCellKey === cellKey(day, time);
  }

  public isNextClass(day: string, time: string): boolean {
    if (!this.nextActiveCellKey) return false;
    return this.nextActiveCellKey === cellKey(day, time);
  }

  private computeActiveAndNextActiveCellKey(): void {
    this.activeCellKey = null;
    this.nextActiveCellKey = null;
    if (!this.studentDetails) return;

    const { timestamp } = this.decryptSessionID(this.studentDetails);
    const currentTime = new Date(Number(timestamp));

    // One week in milliseconds
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

    // Map "now" into the reference week
    const nowInReferenceWeek =
      this.mapDateToReferenceWeekWithoutDate(currentTime);

    // Current time in reference week
    const nowInReferenceWeekMs = nowInReferenceWeek.getTime();

    // Start with infinity
    let smallestGapBetweenClassMs = Number.POSITIVE_INFINITY;

    let nextDayLabel = '';
    let nextHourLabel = '';

    for (const classData of this.studentDetails.data.classes) {
      const classDuration = classData.duration ?? 60;
      const classStartTime = new Date(Number(classData.classTimestamp));

      // class start without date just time and day of week
      const classStartInReferenceWeek =
        this.mapDateToReferenceWeekWithoutDate(classStartTime);

      const classStartInReferenceWeekMs = classStartInReferenceWeek.getTime();

      const classEndInReferenceWeekMs =
        classStartInReferenceWeekMs + classDuration * 60 * 1000;

      if (
        nowInReferenceWeekMs >= classStartInReferenceWeekMs &&
        nowInReferenceWeekMs < classEndInReferenceWeekMs
      ) {
        this.activeCellKey = cellKey(
          dayName(classStartTime),
          hourLabel(classStartTime),
        );
        return;
      }

      // Calculate time until this class
      let gapBetweenClassesMs =
        classStartInReferenceWeekMs - nowInReferenceWeekMs;

      // Add a week if class is earlier in the week
      if (gapBetweenClassesMs <= 0) gapBetweenClassesMs += ONE_WEEK_MS;

      // Update if this class is closer than the previous best
      if (gapBetweenClassesMs < smallestGapBetweenClassMs) {
        smallestGapBetweenClassMs = gapBetweenClassesMs;
        nextDayLabel = dayName(classStartTime);
        nextHourLabel = hourLabel(classStartTime);
      }
    }

    if (smallestGapBetweenClassMs !== Number.POSITIVE_INFINITY) {
      this.nextActiveCellKey = cellKey(nextDayLabel, nextHourLabel);
    }
  }

  private mapDateToReferenceWeekWithoutDate(date: Date): Date {
    // Local Monday anchor: 1970-01-05 (which was a Monday)
    const referenceMondayLocal = new Date(1970, 0, 5, 0, 0, 0, 0);

    // JS: Sunday=0..Saturday=6 → shift so Monday=0..Sunday=6 (LOCAL)
    const weekdayIndexMondayFirst = (date.getDay() + 6) % 7;

    // Clone + bump by weekday
    const referenceDate = new Date(referenceMondayLocal.getTime());
    referenceDate.setDate(
      referenceMondayLocal.getDate() + weekdayIndexMondayFirst,
    );

    // Copy LOCAL clock time
    referenceDate.setHours(
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    );
    return referenceDate;
  }

  public getClassBlock(
    map: Map<CellKey, ClassBlock>,
    day: string,
    time: string,
  ) {
    return map.get(cellKey(day, time));
  }

  public getCurrentDay(): string | null {
    if (!this.studentDetails) return null;
    const { timestamp } = this.decryptSessionID(this.studentDetails);
    return dayName(new Date(Number(timestamp)));
  }
}
