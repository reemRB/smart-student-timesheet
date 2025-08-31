import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StudentDetailsRequest, StudentDetailsResponse } from './student';

interface IStudentService {
  fetchStudentData(
    studentId: string,
  ): Observable<StudentDetailsResponse | undefined>;
}
@Injectable({
  providedIn: 'root',
})
export class StudentService implements IStudentService {
  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  public fetchStudentData(
    studentId: string,
  ): Observable<StudentDetailsResponse | undefined> {
    const body: StudentDetailsRequest = { studentId };
    return this.http.post<StudentDetailsResponse | undefined>(
      `${this.apiUrl}/student/${studentId}`,
      body,
    );
  }
}
