export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  fullName: string;
  avatarUrl: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  participants: string[];
  phoneNumber: string;
  contactName: string;
  contactAvatar: string;
  createdAt: string;
  updatedAt: string;
  type: 'human' | 'ai';
  messages: Message[];
}