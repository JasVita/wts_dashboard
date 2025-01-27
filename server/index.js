// @ts-ignore
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

// Import API routes
import { customerChatsRouter } from "./routes/customerChats.ts";
import { customerStatsRouter } from "./routes/customerStats.ts";
import { messagesRouter } from "./routes/messagesRouter.ts";

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 3) Attach your API routes
app.use("/api", customerChatsRouter);
app.use("/api", customerStatsRouter);
app.use("/api", messagesRouter);

// 6) Listen on port 5000
const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  console.log(`Server and Socket.io is running on port ${PORT}`);
});
