export interface AuthUser {
  id: string;
  email: string;
  apiKey?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error?: string;
}