export interface GPTModel {
  id: string;
  name: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}