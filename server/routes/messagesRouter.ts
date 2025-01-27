import { Router } from "express";
import { io } from "../index.js";
import { pool as db } from "../db.js";

export const messagesRouter = Router();

messagesRouter.post("/messages/python", (req, res) => {
  try {
    // The Python code will send JSON like { wa_id, name, message_type, message_content, db_time_format, ... }
    const { wa_id, message_type, message_content, reply_content, managed, name } = req.body;
    console.log("Received new human message from Python:", req.body);

    // Emit to all clients on the "humanMessage" event
    io.emit("humanMessage", {
      wa_id,
      message_type,
      message_content,
      reply_content,
      managed,
      name,
    });

    res.status(201).json({ message: "Message from python emitted successfuly: ", message_content });
  } catch (error) {
    console.error("Message from python couldn't emit:", error);
    res.status(500).json({ error: "Message from python couldn't emit" });
  }
});

messagesRouter.post("/messages/store", async (req, res) => {
  try {
    const { wa_id, name, language, input_time, weekday, conv_mode, input_content, response } =
      req.body;

    const insertResult = await db.query(
      `
              INSERT INTO daily_message (wa_id, name, language, input_time, weekday, input_type, conv_mode, input_imgid, input_content, response)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
              RETURNING id, wa_id, name, language, input_time, weekday, input_content, response
            `,
      [
        wa_id,
        name,
        language,
        input_time,
        weekday,
        "text",
        conv_mode,
        "null",
        input_content,
        response,
      ]
    );

    if (insertResult.rows.length > 0) {
      const createdMessage: any = insertResult.rows[0];
      res.status(201).json(createdMessage);
    } else {
      throw new Error("Failed to create a new reply.");
    }
  } catch (error) {
    console.error("Failed to store message:", error);
    res.status(500).json({ error: "Failed to store message" });
  }
});
