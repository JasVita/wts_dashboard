import { Router } from "express";
import { getIO } from "../socket"; // Import the `getIO` method from socket.ts

export const pushHumanRouter = Router();

pushHumanRouter.post("/push-human", (req, res) => {
  // The Python code will send JSON like { wa_id, name, message_type, message_content, db_time_format, ... }
  const { wa_id, name, message_type, message_content, db_time_format } = req.body;
  console.log("Received new human message from Python:", req.body);

  // Emit to all clients on the "humanMessage" event
  const io = getIO(); 
  io.emit("humanMessage", {
    wa_id,
    name,
    message_type,
    message_content,
    db_time_format,
  });

  return res.json({ status: "ok" });
});