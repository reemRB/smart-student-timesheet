import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-entry.component.html',
  styleUrl: './student-entry.component.scss',
})
export class StudentEntryComponent {
  studentId: string = '';
}
