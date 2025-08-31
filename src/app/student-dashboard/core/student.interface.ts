import { Observable } from 'rxjs';
import { StudentDetailsResponse } from './student';

export interface IStudent {
  fetchStudentData(
    studentId: string,
  ): Observable<StudentDetailsResponse | undefined>;
}
