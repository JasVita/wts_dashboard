import React from 'react';
import { MessageContent } from './MessageContent';
import { MessageTime } from './MessageTime';
import { MessageType } from './types';

interface MessageBubbleProps {
  content: string;
  type: MessageType;
  timestamp: Date;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  type,
  timestamp,
}) => {
  return (
    <div className="relative mb-10">
      <MessageContent content={content} type={type} />
      <MessageTime type={type} timestamp={timestamp} />
    </div>
  );
};