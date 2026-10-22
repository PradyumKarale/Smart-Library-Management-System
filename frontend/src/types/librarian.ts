export interface LibrarianProfileRecord {
  id: number;
  userId: string;
  employeeId: string;
  designation: string;
  phone: string | null;
  address: string | null;
  joinedAt: string;
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

export interface CreateLibrarianRequest {
  fullName: string;
  email: string;
  password: string;
  employeeId: string;
  designation: string;
  phone?: string;
  address?: string;
}

export interface UpdateLibrarianRequest {
  fullName?: string;
  email?: string;
  employeeId?: string;
  designation?: string;
  phone?: string | null;
  address?: string | null;
}
