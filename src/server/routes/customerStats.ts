import { Router } from "express";
import { CustomerService } from "../services/customerService";

const router = Router();

router.get("/stats/customers", async (_req, res) => {
  try {
    const customers = await CustomerService.getCustomers();
    res.json(customers);
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

router.get("/stats/count", async (_req, res) => {
  try {
    const stats = await CustomerService.getStats();
    res.json({ count: stats.totalCustomers });
  } catch (error) {
    console.error("Failed to fetch customer count:", error);
    res.status(500).json({ error: "Failed to fetch customer count" });
  }
});

router.get("/stats/hotWords", async (_req, res) => {
  try {
    const stats = await CustomerService.getMessages();
    res.json(stats);
  } catch (error) {
    console.error("Failed to fetch hotWords:", error);
    res.status(500).json({ error: "Failed to fetch hotWords" });
  }
});

router.get("/stats/activeUsers", async (_req, res) => {
  try {
    const stats = await CustomerService.getActiveUsers();
    res.json(stats);
    console.log("active users fetched retrieved good");
  } catch (error) {
    console.error("Failed to fetch active users:", error);
    res.status(500).json({ error: "Failed to fetch active users" });
  }
});

router.get("/stats/bookedMeetings", async (_req, res) => {
  try {
    const stats = await CustomerService.getBookedMeetings();
    res.json(stats);
    console.log("booked meetings retrieved good");
  } catch (error) {
    console.error("Failed to fetch booked meetings:", error);
    res.status(500).json({ error: "Failed to fetch booked meetings" });
  }
});

router.get("/stats/AIhandled", async (_req, res) => {
  try {
    const stats = await CustomerService.getAIhandled();
    res.json(stats);
    console.log("AI handled retrieved good");
  } catch (error) {
    console.error("Failed to fetch AI handled:", error);
    res.status(500).json({ error: "Failed to fetch AI handled" });
  }
});

router.get("/stats/WAIDS", async (_req, res) => {
  try {
    const stats = await CustomerService.getWAIDS();
    res.json(stats);
    console.log("WAIDS retrieved good");
  } catch (error) {
    console.error("Failed to fetch WAIDS:", error);
    res.status(500).json({ error: "Failed to fetch WAIDS" });
  }
});

export const customerStatsRouter = router;
