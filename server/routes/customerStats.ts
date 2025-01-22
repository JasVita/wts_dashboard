import { Router } from "express";
import { CustomerStatsService } from "../services/customerStatsService.ts";

const router = Router();

router.get("/stats/activeUsers", async (_req, res) => {
  try {
    const stats = await CustomerStatsService.getData("daily_message", "input_time", "", true);
    res.json(stats);
    console.log("active users fetched retrieved good");
  } catch (error) {
    console.error("Failed to fetch active users:", error);
    res.status(500).json({ error: "Failed to fetch active users" });
  }
});

router.get("/stats/bookedMeetings", async (_req, res) => {
  try {
    const stats = await CustomerStatsService.getData(
      "google_meets",
      "starttime",
      "AND status = 'confirmed'"
    );
    res.json(stats);
    console.log("booked meetings retrieved good");
  } catch (error) {
    console.error("Failed to fetch booked meetings:", error);
    res.status(500).json({ error: "Failed to fetch booked meetings" });
  }
});

router.get("/stats/AIhandled", async (_req, res) => {
  try {
    const stats = await CustomerStatsService.getData(
      "daily_message",
      "input_time",
      `
      AND name NOT IN (
        SELECT name
        FROM daily_message
        WHERE conv_mode != 'AI'
      )
    `,
      true
    );
    res.json(stats);
    console.log("AI handled retrieved good");
  } catch (error) {
    console.error("Failed to fetch AI handled:", error);
    res.status(500).json({ error: "Failed to fetch AI handled" });
  }
});

router.get("/stats/WAIDS", async (_req, res) => {
  try {
    const stats = await CustomerStatsService.getWAIDS();
    res.json(stats);
    console.log("WAIDS retrieved good");
  } catch (error) {
    console.error("Failed to fetch WAIDS:", error);
    res.status(500).json({ error: "Failed to fetch WAIDS" });
  }
});

router.get("/stats/initialMessage", async (_req, res) => {
  try {
    const stats = await CustomerStatsService.getInitialMessage();
    res.json(stats);
    console.log("initial message retrieved good");
  } catch (error) {
    console.error("Failed to fetch initial message:", error);
    res.status(500).json({ error: "Failed to fetch initial message" });
  }
});

export const customerStatsRouter = router;