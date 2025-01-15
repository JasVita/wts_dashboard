import path from "path";
import { fileURLToPath } from "url";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from "http";
import { initSocketIO } from "./socket";

// Import API routes
import { customerStatsRouter } from './routes/customerStats';
import { customerChatsRouter } from './routes/customerChats';
import { messagesRouter } from './routes/messages';
import { chatStatusRouter } from './routes/chatStatus';

import { pushHumanRouter } from "./routes/pushHumanRouter";

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Routes
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

// Create a Socket.IO server
// export const io = new SocketIOServer(server, {
//   cors: {
//     origin: "*", // or your domain if you like, e.g. ["https://portal.turoid.ai"]
//   },
// });

const io = initSocketIO(server);

// (Optional) Listen for new client connections
io.on("connection", (socket) => {
  console.log("New Socket.IO client connected:", socket.id);
});

// 6) Listen on port 5001
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server + Socket.IO running on port ${PORT}`);
});