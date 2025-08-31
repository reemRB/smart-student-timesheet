import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { StudentService } from './student.service';
import { StudentDetailsResponse } from './student';

export interface IStudentFacadeDependencies {
  studentService: StudentService;
}
export class StudentFacade {
  private _studentDetails = new BehaviorSubject<
    StudentDetailsResponse | undefined
  >(undefined);

  public studentDetails$ = this._studentDetails.asObservable();

  constructor(public dependencies: IStudentFacadeDependencies) {}

  public async fetchStudentDetails(studentId: string): Promise<void> {
    const response = await firstValueFrom(
      this.dependencies.studentService.fetchStudentData(studentId),
    );
    this._studentDetails.next(response);
  }
}
