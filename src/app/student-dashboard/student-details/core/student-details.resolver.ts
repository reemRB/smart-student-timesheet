import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { StudentDashboardFacade } from '../../core/student.facade';
import { StudentDashboardService } from '../../core/student.service';
import { StudentDetailsResponse } from '../../core/student';

export const studentResolver: ResolveFn<
  StudentDetailsResponse | undefined
> = async (route, _state): Promise<StudentDetailsResponse | undefined> => {
  const studentId = route.paramMap.get('studentId');
  if (!studentId) {
    throw new Error('No studentId provided');
  }
  const studentService = inject(StudentDashboardService);
  const facade = new StudentDashboardFacade({ studentService });
  await facade.fetchStudentDetails(studentId);
  const details = await firstValueFrom(facade.studentDetails$);
  return details;
};
