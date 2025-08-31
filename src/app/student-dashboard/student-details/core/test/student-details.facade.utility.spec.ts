import { BehaviorSubject } from 'rxjs';
import { StudentDetailsResponse } from '../../../core/student';

export class MockStudentFacade {
  public studentDetails$ = new BehaviorSubject<
    StudentDetailsResponse | undefined
  >(undefined);
}

export function makeSessionId(
  timestampMs: number,
  studentId = '12345',
): string {
  // Use btoa (browser built-in) instead of Buffer
  const encryptedTimestamp = btoa(String(timestampMs));
  return `${encryptedTimestamp}.${studentId}`;
}

/** Create local Date (month is 0-based). */
export function localDate(
  y: number,
  m0: number,
  d: number,
  h: number,
  min = 0,
): Date {
  return new Date(y, m0, d, h, min, 0, 0);
}
