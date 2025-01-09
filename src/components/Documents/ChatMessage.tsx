import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types/documents';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`p-4 rounded-lg max-w-2xl ${
          message.isUser ? 'bg-blue-500 text-white' : 'bg-white'
        }`}
      >
        <p>{message.content}</p>
        <p className="text-xs mt-1 opacity-70">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};