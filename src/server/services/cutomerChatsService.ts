import { db } from "../config/database";
import { CustomerChatsType } from "../types";
import { Chat } from "../../types";

export class CustomerChats {
  static async getChats(): Promise<Chat[]> {
    try {
      const result = await db.query(`
            SELECT id, name, input_content, response, input_time
            FROM daily_message
            ORDER BY name, input_time;
        `);

      const chats: Record<string, Chat> = {};

      result.rows.forEach((row: CustomerChatsType) => {
        const name = row.name;
        if (!chats[name]) {
          chats[name] = {
            id: row.id.toString(), // Use database ID
            name: name,
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
            isAI: false,
            lastMessage: row.input_content || "", // Handle potential null values
            messages: [],
            labels: [{ id: "2", name: "label_palceholder", color: "bg-green-500", count: 1 }], // Add labels later
          };
        }
        chats[name].messages.push({
          content: row.input_content,
          isUser: true,
          timestamp: new Date(row.input_time), // Assuming input_time is a timestamp
        });
        if (row.response) {
          chats[name].messages.push({
            content: row.response,
            isUser: false,
            timestamp: new Date(row.input_time), // Or a slightly later timestamp
          });
        }
        chats[name].lastMessage = chats[name].messages[chats[name].messages.length - 1].content; //Update last message
      });

      return Object.values(chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      throw error;
    }
  }
}
