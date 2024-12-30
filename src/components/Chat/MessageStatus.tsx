import React from 'react';
import { formatMessageTime } from '../../utils/dateFormat';
import { MESSAGE_STATUS } from '../../constants/messages';

interface MessageStatusProps {
  isAI: boolean;
  timestamp: Date;
}

export const MessageStatus: React.FC<MessageStatusProps> = ({
  isAI,
  timestamp,
}) => {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span>{isAI ? MESSAGE_STATUS.AI : MESSAGE_STATUS.HUMAN}</span>
      <span>{formatMessageTime(timestamp)}</span>
    </div>
  );
};