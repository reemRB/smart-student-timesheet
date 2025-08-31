import { StudentDetailsComponent } from './student-details/student-details.component';
import { StudentDashboardComponent } from './student-dashboard.component';
import { StudentEntryComponent } from './student-entry/student-entry.component';
import { studentResolver } from './student-details/core/student-details.resolver';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: StudentDashboardComponent,
    children: [
      { path: '', component: StudentEntryComponent },
      {
        path: ':studentId',
        component: StudentDetailsComponent,
        resolve: { student: studentResolver },
      },
    ],
  },
];
