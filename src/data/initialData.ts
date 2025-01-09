import { Chat, Label } from "../types";
let initialChats: Chat[] = []; 
let initialLabels: Label[] = []; 

export const fetchChats = async (): Promise<Chat[]> => {
  try {
    const response = await fetch("http://localhost:5000/api/chats/customers");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    initialChats = data;
    return initialChats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return []; // Return empty array instead of throwing
  }
};

export const getLabels = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/getTotalLabels/customers");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    initialLabels = data;
    return initialLabels;
  } catch (error) {
    console.error("Error fetching labels:", error);
    return []; // Return empty array instead of throwing
  }
};