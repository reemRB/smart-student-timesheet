export interface StudentDetailsRequest {
  studentId: string;
}

export interface StudentDetailsResponse {
  data: StudentDetails;
}

type StudentDetails = {
  firstName: string;
  lastName: string;
  studentId: string;
  sessionID: string;
  email: string;
  address: string;
  number: string;
  classes: { className: string; classTime: string }[];
};
