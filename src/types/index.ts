export interface CustomerStats {
  totalCustomers: number;
  monthlyGrowth: string;
}

export interface Customer {
  name: string;
}

export interface Chat {
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

export type ChatType = "all" | "human" | "ai" | "labels";
