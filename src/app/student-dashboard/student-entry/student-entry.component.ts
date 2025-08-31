import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../core/student.service';
import { StudentEntryFacade } from './core/student-entry.facade';

@Component({
  selector: 'app-student-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-entry.component.html',
  styleUrl: './student-entry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentEntryComponent {
  public studentId: string = '';
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);

  private entryFacade = new StudentEntryFacade({
    studentService: this.studentService,
    router: this.router,
    route: this.route,
  });

  public loading$ = this.entryFacade.loading$;
  public errorText$ = this.entryFacade.error$;

  public async onSubmit() {
    const result = await this.entryFacade.submit(this.studentId);
    if (result === 'success') {
      this.router.navigate([this.studentId], { relativeTo: this.route });
    }
  }
}
