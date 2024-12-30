import express from "express";
import cors from "cors";
import { customerStatsRouter } from "./routes/customerStats";
import { testConnection } from "./config/database";
import { customerChatsRouter } from "./routes/customerChats";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/stats", customerStatsRouter);
app.use("/api", customerChatsRouter);

const PORT = process.env.PORT || 3000;

// Start server with database connection test
const startServer = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error("Unable to connect to the database. Exiting...");
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();
