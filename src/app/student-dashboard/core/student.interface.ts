import { Observable } from 'rxjs';
import { StudentDetailsResponse } from './student';

export interface IStudentDashboard {
  fetchStudentData(
    studentId: string,
  ): Observable<StudentDetailsResponse | undefined>;
}
