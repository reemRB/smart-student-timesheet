import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-student-timesheet-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-timesheet-table.component.html',
  styleUrl: './student-timesheet-table.component.scss',
})
export class StudentTimesheetTableComponent {
  public days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  public timeSlots = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
  ];
}
