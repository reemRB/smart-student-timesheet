import { NgModule } from '@angular/core';
import { StudentDashboardRoutingModule } from './student-dashboard-routing.module';
import { StudentDashboardComponent } from './student-dashboard.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { StudentEntryComponent } from './student-entry/student-entry.component';

@NgModule({
  imports: [
    StudentDashboardRoutingModule,
    StudentDetailsComponent,
    StudentEntryComponent,
  ],
  declarations: [StudentDashboardComponent],
})
export class StudentDashboardModule {}
