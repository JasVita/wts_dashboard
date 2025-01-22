// @ts-nocheck
import { Router } from "express";
import { CustomerChats } from "../services/cutomerChatsService.ts";

const router = Router();

router.get("/customers/chats", async (_req, res) => {
  try {
    const chats = await CustomerChats.getChats();
    res.json(chats);
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

router.post("/customers/addLabel", async (req, res): Promise<any> => {
  try {
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({ error: "Name, and color are required." });
    }

    const newLabel = {
      name: name,
      color: color,
    };

    const createdLabel = await CustomerChats.addLable(newLabel);

    res.status(201).json(createdLabel);
  } catch (error) {
    console.error("Failed to create a new label:", error);
    res.status(500).json({ error: "Failed to create a new label" });
  }
});

router.delete("/customers/deleteLabel/:labelId", async (req, res): Promise<any> => {
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

router.get("/customers/getTotalLabels", async (_req, res) => {
  try {
    // Fetch all labels using the getTotalLabels function
    const labels = await CustomerChats.getTotalLabels();

    // Return the labels in the response
    res.status(200).json(labels);
  } catch (error) {
    console.error("Failed to fetch total labels:", error);
    res.status(500).json({ error: "Failed to fetch total labels" });
  }
});

router.patch("/customers/assignLabel/:labelId", async (req, res): Promise<any> => {
  const { labelId } = req.params;
  const { wa_id } = req.body;

  if (!wa_id) {
    return res.status(400).json({ error: "wa_id is required" });
  }

  try {
    // Call the assignLabel function
    await CustomerChats.assignLabel(Number(labelId), wa_id);

    // Respond with success message
    res.status(200).json({ message: `wa_id "${wa_id}" added to label ID ${labelId}` });
  } catch (error) {
    console.error(`Failed to assign wa_id to label ID ${labelId}:`, error);
    res.status(500).json({ error: "Failed to assign label" });
  }
});

router.patch("/customers/removeLabel/:labelId", async (req, res): Promise<any> => {
  const { labelId } = req.params;
  const { wa_id } = req.body;

  if (!wa_id) {
    return res.status(400).json({ error: "wa_id is required" });
  }

  try {
    // Call the removeLabel function
    await CustomerChats.removeLabel(Number(labelId), wa_id);

    // Respond with success message
    res.status(200).json({ message: `wa_id "${wa_id}" removed from label ID ${labelId}` });
  } catch (error) {
    console.error(`Failed to remove wa_id from label ID ${labelId}:`, error);
    res.status(500).json({ error: "Failed to remove label" });
  }
});

router.patch("/customers/toggleImportance", async (req, res): Promise<any> => {
  const { wa_id, importance } = req.body;

  if (!wa_id) {
    return res.status(400).json({ error: "wa_id is required" });
  }

  try {
    // Call the removeLabel function
    await CustomerChats.toggleImportance(wa_id, String(importance));

    // Respond with success message
    res.status(200).json({ message: `importance of ${wa_id} was toggled` });
  } catch (error) {
    console.error(`Failed to toggle importance of ${wa_id}:`, error);
    res.status(500).json({ error: "Failed to toggle importance" });
  }
});

router.patch("/customers/toggleConvMode", async (req, res): Promise<any> => {
  const { wa_id, isAI } = req.body;

  if (!wa_id) {
    return res.status(400).json({ error: "wa_id is required" });
  }

  if (typeof isAI !== "boolean") {
    return res.status(400).json({ error: "isAI must be a boolean value" });
  }

  try {
    // Call the toggleConvMode function
    await CustomerChats.toggleConvMode(wa_id, isAI);

    // Respond with a success message
    res.status(200).json({
      message: `conv_mode of last message for ${wa_id} was toggled to ${isAI ? "AI" : "human"}`,
    });
  } catch (error) {
    console.error(`Failed to toggle conv_mode of last message for ${wa_id}:`, error);
    res.status(500).json({ error: "Failed to toggle conv_mode" });
  }
});

export const customerChatsRouter = router;
