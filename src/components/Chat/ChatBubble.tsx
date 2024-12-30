import React from 'react';
import { Label } from '../../types';
import { MessageBubble } from './MessageBubble';

interface ChatBubbleProps {
  content: string;
  isUser: boolean;
  isHuman?: boolean;
  timestamp: Date;
  labels?: Label[];
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  content,
  isUser,
  isHuman,
  timestamp,
  labels
}) => {
  const getMessageType = () => {
    if (isUser) return 'user';
    return isHuman ? 'human' : 'ai';
  };

  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'} mb-14`}>
      <div className="flex flex-col max-w-[70%]">
        <MessageBubble
          content={content}
          type={getMessageType()}
          timestamp={timestamp}
        />
        
        {labels && labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-8">
            {labels.map((label) => (
              <span
                key={label.id}
                className={`px-2 py-0.5 rounded-full text-xs text-white ${label.color}`}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};