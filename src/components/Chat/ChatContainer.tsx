import React, { useEffect } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useAuthStore } from '../../stores/authStore';
import { useChatStore } from '../../stores/chatStore';

export function ChatContainer() {
  const { user } = useAuthStore();
  const { messages, isLoading, error, sendMessage, loadMessages } = useChatStore();

  useEffect(() => {
    if (user?.id) {
      loadMessages(user.id);
    }
  }, [user?.id]);

  const handleSendMessage = async (content: string) => {
    if (!user?.id) return;
    await sendMessage(content, user.id);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600 bg-red-50 px-4 py-2 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} />
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading || !user}
        isLoading={isLoading}
      />
    </div>
  );
}