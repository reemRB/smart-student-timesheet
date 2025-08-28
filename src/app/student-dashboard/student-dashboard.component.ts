import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
  standalone: true,
  imports: [RouterModule],
})
export class StudentDashboardComponent {}
