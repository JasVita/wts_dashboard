import { Router } from "express";
import { CustomerChats } from "../services/cutomerChatsService";

const router = Router();

router.get("/chats/customers", async (req, res) => {
  try {
    const chats = await CustomerChats.getChats();
    res.json(chats);
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// router.get("/labels/customers", async (req, res) => {
//   try {
//     const labels = await CustomerChats.getLabels(req.body.wa_id);
//     res.json(labels);
//   } catch (error) {
//     console.error("Failed to fetch customers:", error);
//     res.status(500).json({ error: "Failed to fetch customers" });
//   }
// });

export const customerChatsRouter = router;
