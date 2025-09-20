import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

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

  { path: 'not-found', component: NotFoundComponent },
  {
    path: '**',
    redirectTo: 'student',
  },
];
