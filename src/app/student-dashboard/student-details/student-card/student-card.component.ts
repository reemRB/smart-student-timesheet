import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StudentFacade } from '../../core/student.facade';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-card.component.html',
  styleUrl: './student-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCardComponent {
  public studentFacade = inject(StudentFacade);
}
