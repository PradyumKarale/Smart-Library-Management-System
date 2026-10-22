export type Role = 'ADMIN' | 'LIBRARIAN' | 'STUDENT';

export interface StudentProfile {
  enrollmentNo: string;
  department: string;
  semester: number;
  year: number;
}

export interface LibrarianProfile {
  employeeId: string;
  designation?: string;
  phone?: string | null;
  address?: string | null;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isActive?: boolean;
  studentProfile?: StudentProfile | null;
  librarianProfile?: LibrarianProfile | null;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type Department = 'CSE' | 'AI_DS' | 'IT' | 'ENTC' | 'MECH' | 'CIVIL';

export interface RegisterStudentRequest {
  fullName: string;
  email: string;
  password: string;
  enrollmentNo: string;
  department: Department;
  semester: number;
  year: number;
}
