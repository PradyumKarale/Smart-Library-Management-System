import { apiClient } from './apiClient';
import { ChatRequest, ChatResponse } from '../types/ai';

export const aiService = {
  sendMessage: async (data: ChatRequest): Promise<ChatResponse> => {
    return apiClient.post<ChatResponse>('/api/ai/chat', data);
  },
};
