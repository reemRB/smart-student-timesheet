import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { StudentFacade } from '../../core/student.facade';
import { StudentService } from '../../core/student.service';
import { StudentDetailsResponse } from '../../core/student';

export const studentResolver: ResolveFn<
  StudentDetailsResponse | undefined
> = async (route, _state): Promise<StudentDetailsResponse | undefined> => {
  const studentId = route.paramMap.get('studentId');
  if (!studentId) {
    throw new Error('No studentId provided');
  }
  const studentService = inject(StudentService);
  const facade = new StudentFacade({ studentService });
  await facade.fetchStudentDetails(studentId);
  const details = await firstValueFrom(facade.studentDetails$);
  return details;
};
