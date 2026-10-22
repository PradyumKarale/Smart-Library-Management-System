export interface StudentProfileRecord {
  id: number;
  userId: string;
  enrollmentNo: string;
  department: string;
  semester: number;
  year: number;
  user: {
    id: string;
    fullName: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    role: {
      roleName: string;
    };
  };
}

export interface UpdateStudentRequest {
  fullName?: string;
  email?: string;
  enrollmentNo?: string;
  department?: string;
  semester?: number;
  year?: number;
}
