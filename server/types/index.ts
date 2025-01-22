export interface CustomerStats {
  totalCustomers: number;
  monthlyGrowth: string;
}
export interface CustomerChatsType {
  input_imgid: any;
  importance: string;
  input_type: string;
  count: number;
  color: string;
  label_id: any;
  label_name: any;
  wa_id: string;
  id: number;
  name: string;
  input_content: string;
  response: any;
  input_time: Date;
  conv_mode: string;
}

export interface Message {
  wa_id: string;
  name: string;
  language: string;
  input_time: string;
  weekday: string;
  response: string;
}

export interface Chat {
  wa_id: string;
  id: string;
  name: string;
  avatar: string;
  isAI: boolean;
  lastMessage: string;
  messages: {
    content: string;
    isUser: boolean;
    isHuman?: boolean;
    timestamp: Date;
    input_type?: string;
    input_imgid?: string;
  }[];
  labels?: Label[];
  isImportant?: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  count: number;
}
