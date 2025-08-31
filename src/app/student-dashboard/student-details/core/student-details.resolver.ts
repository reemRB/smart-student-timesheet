import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { StudentDashboardService } from '../../core/student-dashboard.service';
import { StudentDetails } from '../../core/student-dashboard.interface';

export const studentResolver: ResolveFn<StudentDetails | undefined> = async (
  route,
  _state,
): Promise<StudentDetails | undefined> => {
  const studentId = route.paramMap.get('studentId');
  if (!studentId) {
    throw new Error('No studentId provided');
  }
  const service = inject(StudentDashboardService);
  const response = await firstValueFrom(service.fetchStudentData(studentId));
  // TODO: needs to handle the one without data case
  return response?.data;
};
