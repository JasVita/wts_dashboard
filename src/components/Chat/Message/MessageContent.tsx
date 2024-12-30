import React from 'react';
import { MessageContentProps } from './types';
import { getMessageStyles } from './styles';

export const MessageContent: React.FC<MessageContentProps> = ({ content, type }) => {
  return (
    <div className={`p-3 rounded-lg ${getMessageStyles(type)}`}>
      {content}
    </div>
  );
};