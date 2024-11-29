export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface OpenAIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}