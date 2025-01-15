import { Router } from "express";
import { getIO } from "../socket"; // Import the `getIO` method from socket.ts

export const pushHumanRouter = Router();

pushHumanRouter.post("/push-human", (req, res) => {
  const { wa_id, name, message_type, message_content, db_time_format } = req.body;
  console.log("[pushHumanRouter] Step 1 - Received message:", req.body);

  try {
    const io = getIO();
    console.log("[pushHumanRouter] Step 2 - Got IO instance");

    io.emit("humanMessage", {
      wa_id,
      name,
      message_type,
      message_content,
      db_time_format,
    });
    console.log("[pushHumanRouter] Step 3 - Emitted message");

    // Check connected clients
    const connectedClients = io.sockets.sockets.size;
    console.log("[pushHumanRouter] Connected clients:", connectedClients);

    return res.json({ status: "ok", connectedClients });
  } catch (error) {
    console.error("[pushHumanRouter] Error:", error);
    return res.status(500).json({ error: String(error) });
  }
});