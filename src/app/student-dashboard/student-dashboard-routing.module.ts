import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard.component';
import { NgModule } from '@angular/core';
import { StudentEntryComponent } from './student-entry/student-entry.component';

export const routes: Routes = [
  {
    path: '',
    component: StudentDashboardComponent,
    children: [{ path: '', component: StudentEntryComponent }],
    //resolve
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentDashboardRoutingModule {}
