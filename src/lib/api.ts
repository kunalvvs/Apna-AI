import { supabase } from './supabase';
import { Message } from '../types/chat';
import { ApiResponse } from '../types/api';

export async function saveMessage(message: Message): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase
      .from('messages')
      .insert([{
        id: message.id,
        user_id: message.userId,
        content: message.content,
        role: message.role,
        timestamp: message.timestamp.toISOString(),
      }]);

    if (error) throw error;
    return { data: null, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to save message',
    };
  }
}

export async function fetchMessageHistory(userId: string): Promise<ApiResponse<Message[]>> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    const messages = data?.map(msg => ({
      id: msg.id,
      content: msg.content,
      role: msg.role as 'user' | 'assistant',
      timestamp: new Date(msg.timestamp),
      userId: msg.user_id,
    })) || [];

    return { data: messages, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch messages',
    };
  }
}