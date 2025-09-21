import { BehaviorSubject } from 'rxjs';
import { StudentDetailsResponse } from '../../../../core/student';
import { IStudentFacade } from '../../../../core/student.facade';

export class MockStudentFacade implements IStudentFacade {
  public studentDetails$ = new BehaviorSubject<
    StudentDetailsResponse | undefined
  >(undefined);

  async fetchStudentDetails(_studentId: string): Promise<void> {
    return Promise.resolve();
  }
}

export function makeSessionId(
  timestampMs: number,
  studentId = '12345',
): string {
  const encryptedTimestamp = btoa(String(timestampMs));
  return `${encryptedTimestamp}.${studentId}`;
}

/** Create local Date (month is 0-based). */
export function localDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
): Date {
  return new Date(year, month, day, hour, minute, 0, 0);
}
