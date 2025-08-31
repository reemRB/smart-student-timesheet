// features/student-details/core/student-details.facade.ts
import { StudentFacade } from '../../core/student.facade';
import { map } from 'rxjs/operators';
import { StudentDetailsResponse } from '../../core/student';
import * as CryptoJS from 'crypto-js';

export type CellKey = `${string}|${string}`;

export type ClassBlock = {
  className: string;
  roomNumber: string;
  durationMin: number;
  topPercentage: number;
  heightPercentage: number;
};

interface StudentDetailsFacadeDependencies {
  studentFacade: StudentFacade;
}

interface IStudentDetailsFacade {
  setClassBlock(map: Map<CellKey, ClassBlock>): void;
  getClassBlock(
    map: Map<CellKey, ClassBlock>,
    day: string,
    time: string,
  ): ClassBlock | undefined;

  isActiveClass(day: string, time: string): boolean;

  isNextClass(day: string, time: string): boolean;
}

export class StudentDetailsFacade implements IStudentDetailsFacade {
  private readonly secretKey = 'secretKey';
  private studentDetails: StudentDetailsResponse | undefined;
  private activeCellKey: CellKey | null = null;
  private nextActiveCellKey: CellKey | null = null;

  constructor(private dependencies: StudentDetailsFacadeDependencies) {
    this.dependencies.studentFacade.studentDetails$
      .pipe(
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

      const day = this.dayName(classTime);
      const hourLabel = this.hourLabel(classTime);

      const topPercentage = (classTime.getMinutes() / 60) * 100;

      const heightPercentage = (durationMin / 60) * 100;

      const key = `${day}|${hourLabel}` as CellKey;

      const block: ClassBlock = {
        className: classData.className,
        roomNumber: classData.roomNumber,
        durationMin,
        topPercentage,
        heightPercentage,
      };
      map.set(key, block);
    }
    this.computeActiveAndNextActiveCellKey();
  }

  public decryptSessionID(resp?: StudentDetailsResponse) {
    const sessionID = resp?.data?.sessionID;
    if (!sessionID) throw new Error('No sessionID found');

    const [encryptedTimestamp, studentId] = sessionID.split('.');
    const bytes = CryptoJS.AES.decrypt(encryptedTimestamp, this.secretKey);
    const timestamp = bytes.toString(CryptoJS.enc.Utf8);
    return { timestamp, studentId };
  }

  public isActiveClass(day: string, time: string): boolean {
    if (!this.activeCellKey) return false;
    return this.activeCellKey === this.cellKey(day, time);
  }

  public isNextClass(day: string, time: string): boolean {
    if (!this.nextActiveCellKey) return false;
    return this.nextActiveCellKey === this.cellKey(day, time);
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
    let smallestGapMs = Number.POSITIVE_INFINITY;

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
        this.activeCellKey = this.cellKey(
          this.dayName(classStartTime),
          this.hourLabel(classStartTime),
        );
        return;
      }

      // Calculate time until this class
      let gapMs = classStartInReferenceWeekMs - nowInReferenceWeekMs;

      // Add a week if class is earlier in the week
      if (gapMs <= 0) gapMs += ONE_WEEK_MS;

      // Update if this class is closer than the previous best
      if (gapMs < smallestGapMs) {
        smallestGapMs = gapMs;
        nextDayLabel = this.dayName(classStartTime);
        nextHourLabel = this.hourLabel(classStartTime);
      }
    }

    if (smallestGapMs !== Number.POSITIVE_INFINITY) {
      this.nextActiveCellKey = this.cellKey(nextDayLabel, nextHourLabel);
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

  private cellKey(day: string, hourLabel: string): CellKey {
    return `${day}|${hourLabel}` as CellKey;
  }

  public getClassBlock(
    map: Map<CellKey, ClassBlock>,
    day: string,
    time: string,
  ) {
    return map.get(this.cellKey(day, time));
  }

  private dayName(date: Date): string {
    const namesMondayFirst = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    const idx = (date.getDay() + 6) % 7; // Monday=0 … Sunday=6
    return namesMondayFirst[idx];
  }

  private hourLabel(d: Date): string {
    const h24 = d.getHours();
    const ampm = h24 < 12 ? 'AM' : 'PM';
    let h = h24 % 12;
    if (h === 0) h = 12;
    return `${h}:00 ${ampm}`;
  }
}
