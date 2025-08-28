import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { StudentEntryComponent } from './student-entry/student-entry.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: StudentDashboardComponent,
    children: [
      { path: '', component: StudentEntryComponent },
      { path: ':id', component: StudentDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentDashboardRoutingModule {}
