import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentEntryManager } from './core/student-entry-manager';
import { StudentFacade } from '../core/student.facade';

@Component({
  selector: 'app-student-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-entry.page.html',
  styleUrl: './student-entry.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentEntryComponent {
  public studentId: string = '';
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private studentFacade = inject(StudentFacade);

  private studentEntryManager = new StudentEntryManager({
    studentFacade: this.studentFacade,
    router: this.router,
    route: this.route,
  });

  public loading$ = this.studentEntryManager.loading$;
  public errorText$ = this.studentEntryManager.error$;

  public async onSubmit() {
    await this.studentEntryManager.submit(this.studentId);
  }
}
