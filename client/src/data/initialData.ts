// need customerlist, customer_label, daily_message tables

import { Chat, Label } from "../types";

export const fetchChats = async (): Promise<Chat[]> => {
  try {
    // @ts-ignore
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/chats`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // console.log("checking fetch")
    return data;
  } catch (error) {
    console.error("Error fetching chats: 123", error);
    return [];
  }
};

export const getLabels = async (): Promise<Label[]> => {
  try {
    // @ts-ignore
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/getTotalLabels`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching labels:", error);
    return [];
  }
};
