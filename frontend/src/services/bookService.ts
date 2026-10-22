import { apiClient } from './apiClient';
import { Book, BookFilters, CreateBookRequest, UpdateBookRequest } from '../types/book';

export const bookService = {
  async getAll(filters?: BookFilters): Promise<Book[]> {
    return apiClient.get<Book[]>('/api/books', {
      categoryId: filters?.categoryId,
      search: filters?.search,
    });
  },

  async getById(id: string): Promise<Book> {
    return apiClient.get<Book>(`/api/books/${id}`);
  },

  async create(payload: CreateBookRequest): Promise<Book> {
    return apiClient.post<Book>('/api/books', payload);
  },

  async update(id: string, payload: UpdateBookRequest): Promise<Book> {
    return apiClient.patch<Book>(`/api/books/${id}`, payload);
  },

  async deactivate(id: string): Promise<Book> {
    return apiClient.patch<Book>(`/api/books/${id}/deactivate`);
  },
};
