import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StudentCardComponent } from './student-card/student-card.component';
import { StudentTimesheetTableComponent } from './student-timesheet-table/student-timesheet-table.component';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule, StudentCardComponent, StudentTimesheetTableComponent],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.scss',
})
export class StudentDetailsComponent {}
