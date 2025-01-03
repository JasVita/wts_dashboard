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

router.post("/addLabel/customers", async (req, res) => {
  try {
    const { name, color, customerId } = req.body;

    if (!name || !color || !customerId) {
      return res.status(400).json({ error: "Name, color, and customer ID are required." });
    }

    const newLabel = {
      name: name,
      color: color,
      customerId: customerId,
    };

    const createdLabel = await CustomerChats.addLable(newLabel);

    res.status(201).json(createdLabel);
  } catch (error) {
    console.error("Failed to create a new label:", error);
    res.status(500).json({ error: "Failed to create a new label" });
  }
});

router.delete("/deleteLabel/:labelId", async (req, res) => {
  try {
    const labelId = parseInt(req.params.labelId);

    if (isNaN(labelId)) {
      return res.status(400).json({ error: "Invalid label ID provided." });
    }

    await CustomerChats.deleteLabel(labelId);

    res.status(200).json({ message: `Label with ID ${labelId} has been deleted successfully.` });
  } catch (error) {
    console.error("Failed to delete the label:", error);
    res.status(500).json({ error: "Failed to delete the label." });
  }
});

export const customerChatsRouter = router;
