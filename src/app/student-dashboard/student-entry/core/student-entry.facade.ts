import { BehaviorSubject, Observable } from 'rxjs';
import { StudentEntryFormController } from './student-entry-form-controller';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentFacade } from '../../core/student.facade';

interface IStudentEntryFacade {
  submit(studentId: string): Promise<'success' | 'invalid' | 'error'>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
}
interface IStudentEntryFacadeDependencies {
  studentFacade: StudentFacade;
  router: Router;
  route: ActivatedRoute;
}

export class StudentEntryFacade implements IStudentEntryFacade {
  private studentEntryFormController: StudentEntryFormController;

  private _loading = new BehaviorSubject<boolean>(false);
  private _error = new BehaviorSubject<string | null>(null);

  public loading$ = this._loading.asObservable();
  public error$ = this._error.asObservable();

  constructor(private dependencies: IStudentEntryFacadeDependencies) {
    this.studentEntryFormController = new StudentEntryFormController({
      router: this.dependencies.router,
      route: this.dependencies.route,
      studentFacade: this.dependencies.studentFacade,
    });
  }

  public async submit(studentId: string) {
    this._error.next(null);
    if (this._loading.getValue()) {
      return 'invalid';
    }
    this._loading.next(true);
    try {
      const result =
        await this.studentEntryFormController.submitForm(studentId);
      if (result === 'invalid') {
        this._error.next('Invalid student ID. Please try again.');
      } else if (result === 'error') {
        this._error.next('An error occurred. Please try again.');
      }
      return result;
    } finally {
      this._loading.next(false);
    }
  }
}
