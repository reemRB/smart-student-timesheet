import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StudentCardComponent } from './student-card/student-card.component';
import { StudentTimesheetTableComponent } from './student-timesheet-table/student-timesheet-table.component';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule, StudentCardComponent, StudentTimesheetTableComponent],
  templateUrl: './student-details.page.html',
  styleUrl: './student-details.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDetailsComponent {}
