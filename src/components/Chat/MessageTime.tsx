import React from 'react';
import { formatMessageTime } from '../../utils/dateFormat';
import { MESSAGE_STATUS } from '../../constants/messages';

interface MessageTimeProps {
  type: 'user' | 'ai' | 'human';
  timestamp: Date;
}

export const MessageTime: React.FC<MessageTimeProps> = ({ type, timestamp }) => {
  const getStatusText = () => {
    if (type === 'user') return null;
    return type === 'ai' ? MESSAGE_STATUS.AI : MESSAGE_STATUS.HUMAN;
  };

  const statusText = getStatusText();

  return (
    <div className={`absolute bottom-[-24px] ${type === 'user' ? 'left-0' : 'right-0'} flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap`}>
      <span>{formatMessageTime(timestamp)}</span>
      {statusText && <span>{statusText}</span>}
    </div>
  );
};