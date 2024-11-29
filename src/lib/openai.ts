import { ApiError } from './errors';

const API_URL = import.meta.env.VITE_OPENAI_API_URL;

if (!API_URL) {
  throw new Error('VITE_OPENAI_API_URL is required');
}

export async function generateAIResponse(message: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that provides accurate, informative, and engaging responses.',
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new ApiError(
        errorData?.error?.message || `API error: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new ApiError('Failed to generate AI response');
  }
}