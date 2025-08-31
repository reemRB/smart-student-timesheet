import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { StudentDashboardService } from './student.service';
import { StudentDetailsResponse } from './student';

export interface IStudentFacadeDependencies {
  studentService: StudentDashboardService;
}
export class StudentDashboardFacade {
  private _studentDetails = new BehaviorSubject<
    StudentDetailsResponse | undefined
  >(undefined);

  public studentDetails$ = this._studentDetails.asObservable();

  constructor(public dependencies: IStudentFacadeDependencies) {}

  public async fetchStudentDetails(studentId: string) {
    const response = await firstValueFrom(
      this.dependencies.studentService.fetchStudentData(studentId),
    );
    this._studentDetails.next(response);
  }
}
