import { Book } from './book';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isRateLimited?: boolean;
  matchedBooks?: Book[];
}

export interface ChatRequest {
  message: string;
  history?: Array<{
    role: MessageRole;
    content: string;
  }>;
}

export interface ChatResponse {
  reply: string;
  model: string;
  provider: string;
  isRateLimited?: boolean;
  matchedBooks?: Book[];
}
