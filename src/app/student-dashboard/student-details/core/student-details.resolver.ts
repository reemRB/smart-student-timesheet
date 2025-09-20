import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { StudentFacade } from '../../core/student.facade';
import { StudentDetailsResponse } from '../../core/student';

export const studentResolver: ResolveFn<StudentDetailsResponse | null> = async (
  route,
) => {
  const studentId = route.paramMap.get('studentId');
  const facade = inject(StudentFacade);
  const router = inject(Router);

  if (!studentId) {
    await router.navigate(['/']);
    return null;
  }

  await facade.fetchStudentDetails(studentId);
  const details = await firstValueFrom(facade.studentDetails$);

  if (!details) {
    await router.navigate(['/not-found']);
    return null;
  }

  return details;
};
