import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { StudentService } from './student.service';
import { StudentDetailsResponse } from './student';

@Injectable({ providedIn: 'root' })
export class StudentFacade {
  private _studentDetails = new BehaviorSubject<
    StudentDetailsResponse | undefined
  >(undefined);

  public studentDetails$ = this._studentDetails.asObservable();
  private studentService = inject(StudentService);

  public async fetchStudentDetails(studentId: string): Promise<void> {
    const response = await firstValueFrom(
      this.studentService.fetchStudentData(studentId),
    );
    this._studentDetails.next(response);
  }
}
