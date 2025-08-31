import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { StudentService } from '../../core/student.service';

export type StudentEntrySubmitResult = 'success' | 'invalid' | 'error';

export interface IStudentEntryFormController {
  submitForm(studentId: string): Promise<StudentEntrySubmitResult>;
}

export interface IStudentEntryFormControllerDependencies {
  router: Router;
  route: ActivatedRoute;
  studentService: StudentService;
}

export class StudentEntryFormController implements IStudentEntryFormController {
  constructor(private dependencies: IStudentEntryFormControllerDependencies) {}

  public async submitForm(
    studentId: string,
  ): Promise<StudentEntrySubmitResult> {
    try {
      const response = await firstValueFrom(
        this.dependencies.studentService.fetchStudentData(studentId),
      );
      if (!response?.data) {
        return 'invalid';
      }
      await this.dependencies.router.navigate([studentId], {
        relativeTo: this.dependencies.route,
      });
      return 'success';
    } catch (_error) {
      return 'error';
    }
  }
}
