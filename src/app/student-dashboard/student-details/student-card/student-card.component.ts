import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-card.component.html',
  styleUrl: './student-card.component.scss',
})
export class StudentCardComponent {}
