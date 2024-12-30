import { Router } from "express";
import { CustomerService } from "../services/customerService";

const router = Router();

router.get("/stats/customers", async (req, res) => {
  try {
    const customers = await CustomerService.getCustomers();
    res.json(customers);
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

router.get("/stats/count", async (req, res) => {
  try {
    const stats = await CustomerService.getStats();
    res.json({ count: stats.totalCustomers });
  } catch (error) {
    console.error("Failed to fetch customer count:", error);
    res.status(500).json({ error: "Failed to fetch customer count" });
  }
});

router.get("/stats/hotWords", async (req, res) => {
  try {
    const stats = await CustomerService.getMessages();
    res.json(stats);
  } catch (error) {
    console.error("Failed to fetch hotWords:", error);
    res.status(500).json({ error: "Failed to fetch hotWords" });
  }
});

export const customerStatsRouter = router;
