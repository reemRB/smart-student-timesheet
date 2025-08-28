import { Routes } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard.component';
import { StudentEntryComponent } from './student-entry/student-entry.component';

export const routes: Routes = [
  {
    path: '',
    component: StudentDashboardComponent,
    children: [{ path: '', component: StudentEntryComponent }],
    //resolve
  },
];
