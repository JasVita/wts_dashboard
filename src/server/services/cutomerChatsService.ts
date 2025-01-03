import { db } from "../config/database";
import { CustomerChatsType } from "../types";
import { Chat, Label } from "../../types";

export class CustomerChats {
  static async getChats(): Promise<Chat[]> {
    try {
      // const result = await db.query(`
      //       SELECT id, name, input_content, response, input_time, wa_id
      //       FROM daily_message
      //       ORDER BY name, input_time;
      //   `);
      const result = await db.query(`
          SELECT dm.id, dm.name, dm.input_content, dm.response, dm.input_time, dm.wa_id, cl.name as label_name, cl.id as label_id, cl.color, cl.count
          FROM daily_message dm
          LEFT JOIN customer_label cl ON dm.wa_id = cl.customer_id
          ORDER BY dm.name, dm.input_time;
        `);

      const chats: Record<string, Chat> = {};

      result.rows.forEach((row: CustomerChatsType) => {
        const name = row.name;
        if (!chats[name]) {
          chats[name] = {
            id: row.id.toString(), // Use database ID
            name: name,
            avatar:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
            isAI: false,
            lastMessage: row.input_content || "", // Handle potential null values
            messages: [],
            labels: [], // Add labels later
          };
        }
        if (row.label_name) {
          // Check if chats[name] and chats[name].labels are defined before accessing them
          if (chats[name] && chats[name].labels) {
            // @ts-ignore
            const existingLabel = chats[name].labels.find(
              (label) => label.id === row.label_id.toString()
            );
            if (!existingLabel) {
              // @ts-ignore
              chats[name].labels.push({
                id: row.label_id.toString(),
                name: row.label_name,
                color: row.color,
                count: row.count,
              });
            }
          }
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

  static async getLabels(customerId: number): Promise<Label[]> {
    try {
      const result = await db.query(
        `
            SELECT name, id, color, count
            FROM customer_label
            WHERE customer_id = $1
            ORDER BY name
        `,
        [customerId]
      );

      return result.rows;
    } catch (error) {
      console.error("Error fetching labels:", error);
      throw error;
    }
  }
}
