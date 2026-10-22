import { apiClient } from './apiClient';
import { AuthResponseData, LoginRequest, RegisterStudentRequest, User } from '../types/auth';

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponseData> {
    return apiClient.post<AuthResponseData>('/api/auth/login', payload);
  },

  async registerStudent(payload: RegisterStudentRequest): Promise<AuthResponseData> {
    return apiClient.post<AuthResponseData>('/api/auth/register/student', payload);
  },

  async getMe(): Promise<{ user: User }> {
    return apiClient.get<{ user: User }>('/api/auth/me');
  },
};
