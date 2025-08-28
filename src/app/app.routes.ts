import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'student',
    loadChildren: () =>
      import('./student-dashboard/student-dashboard.module').then(
        (m) => m.StudentDashboardModule,
      ),
  },
];
