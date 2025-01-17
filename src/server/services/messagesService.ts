import { Message } from "../types";
import { db } from "../config/rm3_database";

export class MessagesService {
  static async storeMessage(
    wa_id: string,
    name: string,
    language: string,
    input_time: string,
    weekday: string,
    response: string,
    conv_mode: string 
  ): Promise<Message> {
    try {
      // Insert the new message into the database
      const insertResult = await db.query(
        `
        INSERT INTO daily_message (wa_id, name, language, input_time, weekday, input_type, conv_mode, input_imgid, response)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, wa_id, name, language, input_time, weekday, response
      `,
        [wa_id, name, language, input_time, weekday, "text", conv_mode, "null", response]
      );

      if (insertResult.rows.length > 0) {
        const createdMessage: Message = insertResult.rows[0];
        return createdMessage;
      } else {
        throw new Error("Failed to create a new Message.");
      }
    } catch (error) {
      console.error("Error creating a new Message:", error);
      throw error;
    }
  }
}
