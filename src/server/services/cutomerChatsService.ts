import { db } from "../config/database";
import { CustomerChatsType } from "../types";
import { Chat, Label } from "../../types";
interface NewLabel {
  name: string;
  color: string;
  customerId: number;
}
export class CustomerChats {
  static async getChats(): Promise<Chat[]> {
    try {
      const result = await db.query(`
          SELECT dm.id, dm.name, dm.input_content, dm.response, dm.input_time, dm.input_type, dm.wa_id, cl.name as label_name, cl.id as label_id, cl.color, cl.count
          FROM daily_message dm
          LEFT JOIN customer_label cl ON dm.wa_id = ANY(cl.customer_id) -- Match wa_id against TEXT[] column
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
            wa_id: row.wa_id,
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
        if (row.input_content) {
          chats[name].messages.push({
            content: row.input_content,
            isUser: true,
            timestamp: new Date(row.input_time), // Assuming input_time is a timestamp
            input_type: row.input_type,
          });
        }
        if (row.response) {
          chats[name].messages.push({
            content: row.response,
            isUser: false,
            timestamp: new Date(row.input_time), // Or a slightly later timestamp
            input_type: row.input_type,
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

  static async getTotalLabels(): Promise<Label[]> {
    try {
      const result = await db.query(
        `
          SELECT id, name, color, count
          FROM customer_label
        `
      );

      // Map the rows to the Label interface
      return result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        color: row.color,
        count: row.count,
      }));
    } catch (error) {
      console.error("Error fetching labels:", error);
      throw error;
    }
  }

  static async addLable(newLabel: NewLabel): Promise<Label> {
    try {
      // Ensure customerId is passed as an array
      const customerIdsArray = Array.isArray(newLabel.customerId)
        ? newLabel.customerId
        : [newLabel.customerId];

      // Insert the new label into the database
      const insertResult = await db.query(
        `
        INSERT INTO customer_label (name, color, count, customer_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, color, count
      `,
        [newLabel.name, newLabel.color, 1, customerIdsArray]
      );

      if (insertResult.rows.length > 0) {
        const createdLabel: Label = insertResult.rows[0];
        return createdLabel;
      } else {
        throw new Error("Failed to create a new label.");
      }
    } catch (error) {
      console.error("Error creating a new label:", error);
      throw error;
    }
  }

  static async deleteLabel(labelId: number): Promise<void> {
    try {
      // Delete the label from the database
      const deleteResult = await db.query(
        `
            DELETE FROM customer_label
            WHERE id = $1
            RETURNING id
            `,
        [labelId]
      );

      if (deleteResult.rows.length > 0) {
        console.log(`Label with ID ${labelId} has been successfully deleted.`);
      } else {
        throw new Error(`Label with ID ${labelId} not found or could not be deleted.`);
      }
    } catch (error) {
      console.error("Error deleting the label:", error);
      throw error;
    }
  }

  static async assignLabel(labelId: number, waId: string): Promise<void> {
    try {
      // Update the customer_id array for the matching labelId
      await db.query(
        `
        UPDATE customer_label
        SET customer_id = array_append(customer_id, $1::text)
        WHERE id = $2 AND NOT ($1 = ANY(customer_id))
        `,
        [waId, labelId]
      );

      console.log(`wa_id "${waId}" added to label ID ${labelId}`);
    } catch (error) {
      console.error("Error assigning wa_id to label:", error);
      throw error;
    }
  }

  static async removeLabel(labelId: number, waId: string): Promise<void> {
    try {
      // Remove the wa_id from the customer_id array for the matching labelId
      await db.query(
        `
        UPDATE customer_label
        SET customer_id = array_remove(customer_id, $1::text)
        WHERE id = $2
        `,
        [waId, labelId]
      );

      console.log(`wa_id "${waId}" removed from label ID ${labelId}`);
    } catch (error) {
      console.error("Error removing wa_id from label:", error);
      throw error;
    }
  }
}
