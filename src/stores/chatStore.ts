import { create } from 'zustand';
import { Message } from '../types/chat';
import { generateLocalResponse } from '../lib/localAI';
import { saveMessage, fetchMessageHistory } from '../lib/api';
import { v4 as uuidv4 } from 'uuid';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, userId: string) => Promise<void>;
  loadMessages: (userId: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  sendMessage: async (content: string, userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Add user message
      const userMessage: Message = {
        id: uuidv4(),
        content,
        role: 'user',
        timestamp: new Date(),
        userId,
      };

      set(state => ({
        messages: [...state.messages, userMessage],
      }));

      await saveMessage(userMessage);

      // Generate local AI response
      const aiResponse = await generateLocalResponse(content);
      
      const aiMessage: Message = {
        id: uuidv4(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        userId,
      };

      await saveMessage(aiMessage);

      set(state => ({
        messages: [...state.messages, aiMessage],
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to send message' 
      });
    } finally {
      set({ isLoading: false });
    }
  },

  loadMessages: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await fetchMessageHistory(userId);
      
      if (error) throw new Error(error);
      
      set({ 
        messages: data || [],
        error: null,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load messages' 
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearMessages: () => {
    set({ messages: [], error: null });
  },
}));