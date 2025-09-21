import { BehaviorSubject, Observable } from 'rxjs';
import { StudentEntryFormController } from './student-entry-form-controller';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentFacade } from '../../core/student.facade';

interface IStudentEntryManager {
  submit(studentId: string): Promise<void>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
}
interface IStudentEntryManagerDependencies {
  studentFacade: StudentFacade;
  router: Router;
  route: ActivatedRoute;
}

export class StudentEntryManager implements IStudentEntryManager {
  private studentEntryFormController: StudentEntryFormController;

  private _loading = new BehaviorSubject<boolean>(false);
  private _error = new BehaviorSubject<string | null>(null);

  public loading$ = this._loading.asObservable();
  public error$ = this._error.asObservable();

  constructor(private dependencies: IStudentEntryManagerDependencies) {
    this.studentEntryFormController = new StudentEntryFormController({
      router: this.dependencies.router,
      route: this.dependencies.route,
      studentFacade: this.dependencies.studentFacade,
    });
  }

  public async submit(studentId: string) {
    this._error.next(null);
    this._loading.next(true);
    try {
      const result =
        await this.studentEntryFormController.submitForm(studentId);
      if (result === 'invalid') {
        this._error.next('Invalid student ID. Please try again.');
      } else if (result === 'error') {
        this._error.next('An error occurred. Please try again.');
      }
    } finally {
      this._loading.next(false);
    }
  }
}
