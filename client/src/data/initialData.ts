import axios from "axios";
import { Chat, Label } from "../types";

export const fetchChats = async (): Promise<Chat[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customers/chats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
};

export const getLabels = async (): Promise<Label[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customers/getTotalLabels`);
    return response.data;
  } catch (error) {
    console.error("Error fetching labels:", error);
    return [];
  }
};
