import { apiClient } from './apiClient';
import { Category, CreateCategoryRequest } from '../types/book';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return apiClient.get<Category[]>('/api/categories');
  },

  async create(payload: CreateCategoryRequest): Promise<Category> {
    return apiClient.post<Category>('/api/categories', payload);
  },
};
