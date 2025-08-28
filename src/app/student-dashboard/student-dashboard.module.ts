import { NgModule } from '@angular/core';
import { StudentDashboardRoutingModule } from './student-dashboard-routing.module';
import { StudentDashboardComponent } from './student-dashboard.component';

@NgModule({
  imports: [StudentDashboardRoutingModule],
  providers: [],
  declarations: [StudentDashboardComponent],
})
export class StudentDashboardModule {}
