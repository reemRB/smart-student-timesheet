import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'student',
    loadChildren: () =>
      import('./student-dashboard/student-dashboard.routes').then(
        (m) => m.routes,
      ),
  },
];
