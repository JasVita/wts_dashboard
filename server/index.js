// @ts-ignore
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

// Import API routes
import { customerChatsRouter } from "./routes/customerChats.ts";
import { customerStatsRouter } from "./routes/customerStats.ts";
import { pushHumanRouter } from "./routes/pushHumanRouter.ts";

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const clients = new Map();
let adminSocket = null;

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const { userId, role } = socket.handshake.query;

  if (role === "admin") {
    adminSocket = socket;
    console.log("Admin connected");
  } else {
    clients.set(userId, socket);
    console.log(`Client connected: ${userId}`);
  }

  // Client sends a message
  socket.on("clientMessage", ({ message, clientId }) => {
    if (adminSocket) {
      adminSocket.emit("messageFromClient", { clientId, message });
    }
  });

  // Admin sends a message
  socket.on("adminMessage", ({ message, clientId }) => {
    const clientSocket = clients.get(clientId);
    if (clientSocket) {
      clientSocket.emit("messageFromAdmin", { message });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    if (role === "admin") {
      console.log("Admin disconnected");
      adminSocket = null;
    } else {
      clients.delete(userId);
      console.log(`Client disconnected: ${userId}`);
    }
  });
});

// 3) Attach your API routes
app.use("/api", customerChatsRouter);
app.use("/api", customerStatsRouter);
app.use("/api", pushHumanRouter);

// 6) Listen on port 5000
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server and Socket.io is running on port ${PORT}`);
});
