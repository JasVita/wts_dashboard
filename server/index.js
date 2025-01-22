// @ts-ignore
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import API routes
import { customerChatsRouter } from "./routes/customerChats.ts";
import { customerStatsRouter } from "./routes/customerStats.ts";

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// 3) Attach your API routes
app.use("/api", customerChatsRouter);
app.use("/api", customerStatsRouter);

// 6) Listen on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
