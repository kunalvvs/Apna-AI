export interface Message {
  id: string;
  content: string;
  role: 'assistant' | 'user';
  timestamp: Date;
  userId?: string;
}

export interface User {
  id: string;
  email: string;
  apiKey?: string;
}