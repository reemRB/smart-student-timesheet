import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StudentFacade } from '../../core/student.facade';
import { StudentTimesheetTableManager } from './core/student-timesheet-table-manager';
import { ClassBlock } from './core/student-timesheet-table-helper-functions';

type CellKey = `${string}|${string}`;

@Component({
  selector: 'app-student-timesheet-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-timesheet-table.component.html',
  styleUrls: ['./student-timesheet-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentTimesheetTableComponent {
  private studentFacade = inject(StudentFacade);
  public studentDetailsFacade: StudentTimesheetTableManager;

  // Ordered list of days we want to render as columns (or headers)
  public days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Hourly slots
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

  public classByCell = new Map<CellKey, ClassBlock>();

  constructor() {
    this.studentDetailsFacade = new StudentTimesheetTableManager({
      studentFacade: this.studentFacade,
    });
    this.studentDetailsFacade.setClassBlock(this.classByCell);
  }

  public getClassBlock(day: string, time: string) {
    return this.studentDetailsFacade.getClassBlock(this.classByCell, day, time);
  }

  public isActiveClass(day: string, time: string): boolean {
    return this.studentDetailsFacade.isActiveClass(day, time);
  }

  public isNextClass(day: string, time: string): boolean {
    return this.studentDetailsFacade.isNextClass(day, time);
  }
}
