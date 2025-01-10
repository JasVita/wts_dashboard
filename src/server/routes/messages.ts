import { Router } from "express";
import { MessagesService } from "../services/messagesService";

const router = Router();

router.post("/messages/store", async (req, res) => {
  try {
    // const { wa_id, name, language, input_time, weekday, response } = req.body;
    const { wa_id, name, language, input_time, weekday, response, conv_mode } = req.body;
    const message = await MessagesService.storeMessage(
      wa_id,
      name,
      language,
      input_time,
      weekday,
      response,
      conv_mode
    );
    res.json(message);
  } catch (error) {
    console.error("Failed to store message:", error);
    res.status(500).json({ error: "Failed to store message" });
  }
});

export const messagesRouter = router;
