import path from "path";
import { fileURLToPath } from "url";

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { createServer } from "http";
// import { Server as SocketIOServer } from "socket.io";

// Import API routes
import { customerStatsRouter } from './routes/customerStats';
import { customerChatsRouter } from './routes/customerChats';
import { messagesRouter } from './routes/messages';
import { chatStatusRouter } from './routes/chatStatus';

import { pushHumanRouter } from "./routes/pushHumanRouter";
import { initSocketIO } from "./socket";

dotenv.config();

// 1) Emulate __filename and __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for all routes
// app.use(cors());
// Update CORS config
app.use(cors({
  origin: ["http://localhost:8080", "https://portal.turoid.ai"],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

// 2) Serve the React build from "/dist"
const distPath = path.join(__dirname, "../../dist");
app.use(express.static(distPath));

// 3) Attach your API routes
app.use('/api/stats', customerStatsRouter);
app.use('/api', customerChatsRouter);
app.use('/api', messagesRouter);
app.use('/api', chatStatusRouter);

// 4) Attach the new pushHumanRouter for the event-based flow
app.use("/api", pushHumanRouter);

// 5) Fallback route to serve index.html for any non-API route
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Create an HTTP server from `app`
const server = createServer(app);
console.log("[Server] HTTP server created");

// Create a Socket.IO server
// export const io = new SocketIOServer(server, {
//   cors: {
//     origin: "*", // or your domain if you like, e.g. ["https://portal.turoid.ai"]
//   },
// });

const io = initSocketIO(server);
console.log("[Server] Socket.IO server initialized");

// (Optional) Listen for new client connections
io.on("connection", (socket) => {
  console.log("New Socket.IO client connected:", socket.id);
});

// 6) Listen on port 5000
const PORT = process.env.PORT || 5000;

// Remove duplicate connection handler
io.engine.on("connection_error", (err) => {
  console.log("[Socket] Connection error:", {
    code: err.code,
    message: err.message,
    type: err.type,
    req: {
      url: err.req?.url,
      headers: err.req?.headers
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server + Socket.IO running on port ${PORT}`);
  console.log(`[Server] Socket.IO path: ${io.path()}`);
});