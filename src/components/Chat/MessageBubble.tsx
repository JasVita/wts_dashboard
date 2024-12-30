import React from 'react';
import { MessageTime } from './MessageTime';

interface MessageBubbleProps {
  content: string;
  type: 'user' | 'ai' | 'human';
  timestamp: Date;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  type,
  timestamp,
}) => {
  const bubbleStyles = {
    user: 'bg-white text-gray-800',
    ai: 'bg-blue-500 text-white',
    human: 'bg-green-500 text-white',
  };

  return (
    <div className="relative mb-6">
      <div className={`p-3 rounded-lg ${bubbleStyles[type]}`}>
        {content}
      </div>
      <MessageTime type={type} timestamp={timestamp} />
    </div>
  );
};