export type MessageType = 'user' | 'ai' | 'human';

export interface MessageStyleProps {
  type: MessageType;
  align: 'left' | 'right';
}

export interface MessageTimeProps {
  type: MessageType;
  timestamp: Date;
}

export interface MessageContentProps {
  content: string;
  type: MessageType;
}