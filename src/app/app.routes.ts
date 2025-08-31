import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'student',
    pathMatch: 'full',
  },
  {
    path: 'student',
    loadChildren: () =>
      import('./student-dashboard/student-dashboard.routes').then(
        (m) => m.routes,
      ),
  },
  {
    path: '**',
    redirectTo: 'student',
  },
];
