import { ValidationError } from './errors';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateApiKey(apiKey: string): void {
  if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
    throw new ValidationError('Invalid API key format');
  }
}