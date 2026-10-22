import { apiClient } from './apiClient';
import { CreateLibrarianRequest, LibrarianProfileRecord, UpdateLibrarianRequest } from '../types/librarian';

export const librarianService = {
  async getAll(): Promise<LibrarianProfileRecord[]> {
    return apiClient.get<LibrarianProfileRecord[]>('/api/librarians');
  },

  async getByUserId(userId: string): Promise<LibrarianProfileRecord> {
    return apiClient.get<LibrarianProfileRecord>(`/api/librarians/${userId}`);
  },

  async create(payload: CreateLibrarianRequest): Promise<LibrarianProfileRecord> {
    return apiClient.post<LibrarianProfileRecord>('/api/librarians', payload);
  },

  async update(userId: string, payload: UpdateLibrarianRequest): Promise<LibrarianProfileRecord> {
    return apiClient.patch<LibrarianProfileRecord>(`/api/librarians/${userId}`, payload);
  },

  async updateStatus(userId: string, isActive: boolean): Promise<LibrarianProfileRecord> {
    return apiClient.patch<LibrarianProfileRecord>(`/api/librarians/${userId}/status`, { isActive });
  },
};
