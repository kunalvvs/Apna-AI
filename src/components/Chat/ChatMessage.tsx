import React from 'react';
import { Bot, User } from 'lucide-react';

export interface Message {
  id: string;
  content: string;
  role: 'assistant' | 'user';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex gap-4 p-4 ${isAssistant ? 'bg-gray-50' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isAssistant ? 'bg-blue-600 text-white' : 'bg-gray-200'
      }`}>
        {isAssistant ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className="flex-1">
        <div className="font-medium mb-1">
          {isAssistant ? 'AI Assistant' : 'You'}
        </div>
        <div className="text-gray-700 leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  );
}