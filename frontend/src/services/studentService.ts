import { apiClient } from './apiClient';
import { StudentProfileRecord, UpdateStudentRequest } from '../types/student';

export const studentService = {
  async getAll(): Promise<StudentProfileRecord[]> {
    return apiClient.get<StudentProfileRecord[]>('/api/students');
  },

  async getByUserId(userId: string): Promise<StudentProfileRecord> {
    return apiClient.get<StudentProfileRecord>(`/api/students/${userId}`);
  },

  async update(userId: string, payload: UpdateStudentRequest): Promise<StudentProfileRecord> {
    return apiClient.patch<StudentProfileRecord>(`/api/students/${userId}`, payload);
  },

  async updateStatus(userId: string, isActive: boolean): Promise<StudentProfileRecord> {
    return apiClient.patch<StudentProfileRecord>(`/api/students/${userId}/status`, { isActive });
  },
};
