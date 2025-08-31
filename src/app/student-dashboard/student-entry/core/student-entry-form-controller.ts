import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { StudentFacade } from '../../core/student.facade';

export type StudentEntrySubmitResult = 'success' | 'invalid' | 'error';

export interface IStudentEntryFormController {
  submitForm(studentId: string): Promise<StudentEntrySubmitResult>;
}

export interface IStudentEntryFormControllerDependencies {
  router: Router;
  route: ActivatedRoute;
  studentFacade: StudentFacade;
}

export class StudentEntryFormController implements IStudentEntryFormController {
  constructor(private dependencies: IStudentEntryFormControllerDependencies) {}

  public async submitForm(
    studentId: string,
  ): Promise<StudentEntrySubmitResult> {
    try {
      const studentDetails = await firstValueFrom(
        this.dependencies.studentFacade.studentDetails$,
      );
      if (!studentDetails) {
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
