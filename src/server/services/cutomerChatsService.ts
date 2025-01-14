import { db } from "../config/database";
import { CustomerChatsType } from "../types";
import { Chat, Label } from "../../types";
interface NewLabel {
  name: string;
  color: string;
}
export class CustomerChats {
  static async getChats(): Promise<Chat[]> {
    try {
      const result = await db.query(`
          SELECT dm.id, dm.name, dm.input_content, dm.response, dm.input_time, dm.input_type, dm.wa_id, dm.conv_mode, dm.input_imgid,
          cl.labelname as label_name, 
          cl.id as label_id, 
          cl.color, cl.count,
          c.importance
          FROM daily_message dm
          LEFT JOIN customer_label cl ON dm.wa_id = ANY(cl.customer_id) 
          LEFT JOIN customerlist c ON dm.wa_id = c.wa_id
          ORDER BY dm.name, dm.input_time;
        `);

      const chats: Record<string, Chat> = {};
      result.rows.forEach((row: CustomerChatsType) => {
        const name = row.name;
        const isImportant = row.importance === "true";
        if (!chats[name]) {
          chats[name] = {
            wa_id: row.wa_id,
            id: row.id.toString(), // Use database ID
            name: name,
            avatar:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
            isAI: false,
            lastMessage: row.input_content || "", // Handle potential null values
            messages: [],
            labels: [], // Add labels later
            isImportant: isImportant,
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
            input_imgid: row.input_imgid,
          });
        }
        if (row.response) {
          // const isHuman = row.response.startsWith("[HUMAN]");
          const isHuman = row.conv_mode === "human";
          chats[name].messages.push({
            // content: row.response.replace("[HUMAN] ", ""),
            content: row.response,
            isUser: false,
            isHuman: isHuman,
            timestamp: new Date(row.input_time), // Or a slightly later timestamp
            input_type: row.input_type,
          });
        }
        chats[name].lastMessage = chats[name].messages[chats[name].messages.length - 1].content; //Update last message
        // Set isAI based on conv_mode of the last message row
        const lastConvMode = row.conv_mode; // Get the last message's conv_mode
        chats[name].isAI = lastConvMode === "AI";
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
          SELECT id, labelname, color, count
          FROM customer_label
        `
      );

      // Map the rows to the Label interface
      return result.rows.map((row: any) => ({
        id: row.id,
        name: row.labelname,
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
      const customerIdsArray: never[] = [];

      // Insert the new label into the database
      const insertResult = await db.query(
        `
        INSERT INTO customer_label (labelname, color, count, customer_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, labelname, color, count
      `,
        [newLabel.name, newLabel.color, 0, customerIdsArray]
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
      // Fetch the label name corresponding to the labelId
      const result = await db.query(
        `
        SELECT labelname FROM customer_label
        WHERE id = $1
        `,
        [labelId]
      );

      if (result.rows.length === 0) {
        throw new Error(`Label with ID ${labelId} not found.`);
      }

      const labelName = result.rows[0].labelname;

      // Delete the label from the customer_label table
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

        // Remove the label name from the labelname column in the customerlist table
        await db.query(
          `
          UPDATE customerlist
          SET labelname = array_remove(labelname, $1::text)
          `,
          [labelName]
        );

        console.log(`Removed all instances of label "${labelName}" from customerlist.`);
      } else {
        throw new Error(`Label with ID ${labelId} could not be deleted.`);
      }
    } catch (error) {
      console.error("Error deleting the label:", error);
      throw error;
    }
  }

  static async assignLabel(labelId: number, waId: string): Promise<void> {
    try {
      // Begin a transaction to ensure consistency between updates
      await db.query("BEGIN");

      // Add waId to customer_id array and increment count
      await db.query(
        `
        UPDATE customer_label
        SET 
          customer_id = array_append(customer_id, $1::text),
          count = count + 1
        WHERE id = $2 AND NOT ($1 = ANY(customer_id))
        `,
        [waId, labelId]
      );

      // Get the label name for the given labelId
      const result = await db.query(
        `
        SELECT labelname FROM customer_label
        WHERE id = $1
        `,
        [labelId]
      );
      const labelName = result.rows[0]?.labelname;

      // Add the label name to the labelname column in the customerlist table
      if (labelName) {
        await db.query(
          `
          UPDATE customerlist
          SET labelname = array_append(labelname, $1::text)
          WHERE wa_id = $2
          `,
          [labelName, waId]
        );
      }

      // Commit the transaction
      await db.query("COMMIT");

      console.log(
        `wa_id "${waId}" added to label ID ${labelId} and labelname updated in customerlist`
      );
    } catch (error) {
      // Rollback in case of any error
      await db.query("ROLLBACK");
      console.error("Error assigning wa_id to label and updating customerlist:", error);
      throw error;
    }
  }

  static async removeLabel(labelId: number, waId: string): Promise<void> {
    try {
      // Begin a transaction to ensure consistency between updates
      await db.query("BEGIN");

      // Remove waId from customer_id array and decrement count
      await db.query(
        `
        UPDATE customer_label
        SET 
          customer_id = array_remove(customer_id, $1::text),
          count = GREATEST(count - 1, 0) -- Ensure count doesn't go below 0
        WHERE id = $2 AND $1 = ANY(customer_id)
        `,
        [waId, labelId]
      );

      // Get the label name for the given labelId
      const result = await db.query(
        `
        SELECT labelname FROM customer_label
        WHERE id = $1
        `,
        [labelId]
      );
      const labelName = result.rows[0]?.labelname;

      // Remove the label name from the labelname column in the customerlist table
      if (labelName) {
        await db.query(
          `
          UPDATE customerlist
          SET labelname = array_remove(labelname, $1::text)
          WHERE wa_id = $2
          `,
          [labelName, waId]
        );
      }

      // Commit the transaction
      await db.query("COMMIT");

      console.log(
        `wa_id "${waId}" removed from label ID ${labelId} and labelname updated in customerlist`
      );
    } catch (error) {
      // Rollback in case of any error
      await db.query("ROLLBACK");
      console.error("Error removing wa_id from label and updating customerlist:", error);
      throw error;
    }
  }

  static async toggleImportance(waId: string, importance: string): Promise<void> {
    try {
      // Update the importance column for the row with the matching wa_id
      const updateResult = await db.query(
        `
        UPDATE customerlist
        SET importance = $1
        WHERE wa_id = $2
        RETURNING wa_id, importance
        `,
        [importance, waId]
      );

      if (updateResult.rows.length > 0) {
        console.log(`Successfully updated importance for wa_id "${waId}" to "${importance}".`);
      } else {
        throw new Error(`No matching row found for wa_id "${waId}".`);
      }
    } catch (error) {
      console.error("Error switching importance:", error);
      throw error;
    }
  }

  static async toggleConvMode(waId: string, isAI: boolean): Promise<void> {
    try {
      // Determine the conv_mode based on isAI
      const convMode = isAI ? "AI" : "human";

      // Update the conv_mode column for the last message row with the matching wa_id
      const updateResult = await db.query(
        `
        UPDATE daily_message
        SET conv_mode = $1
        WHERE id = (
          SELECT id 
          FROM daily_message
          WHERE wa_id = $2
          ORDER BY input_time DESC
          LIMIT 1
        )
        RETURNING wa_id, conv_mode
        `,
        [convMode, waId]
      );

      if (updateResult.rows.length > 0) {
        console.log(
          `Successfully updated conv_mode for the last message with wa_id "${waId}" to "${convMode}".`
        );
      } else {
        throw new Error(`No matching row found for wa_id "${waId}".`);
      }
    } catch (error) {
      console.error("Error switching conv_mode:", error);
      throw error;
    }
  }
}
