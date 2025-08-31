import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentEntryFacade } from './core/student-entry.facade';
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

  private studentEntryFacade = new StudentEntryFacade({
    studentFacade: this.studentFacade,
    router: this.router,
    route: this.route,
  });

  public loading$ = this.studentEntryFacade.loading$;
  public errorText$ = this.studentEntryFacade.error$;

  public async onSubmit() {
    const result = await this.studentEntryFacade.submit(this.studentId);
    if (result === 'success') {
      this.router.navigate([this.studentId], { relativeTo: this.route });
    }
  }
}
