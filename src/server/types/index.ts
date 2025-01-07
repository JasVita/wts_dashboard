export interface CustomerStats {
  totalCustomers: number;
  monthlyGrowth: string;
}
export interface CustomerChatsType {
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
}

export interface Message {
  wa_id: string;
  name: string;
  language: string;
  input_time: string;
  weekday: string;
  response: string;
}
