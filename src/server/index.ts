import path from "path";
import { fileURLToPath } from "url";

import express from 'express';
import cors from 'cors';

import { createServer } from "http";

// Import API routes
import { env } from './config/env';
import { customerStatsRouter } from './routes/customerStats';
import { customerChatsRouter } from './routes/customerChats';
import { messagesRouter } from './routes/messages';
import { chatStatusRouter } from './routes/chatStatus';
import { pushHumanRouter } from './routes/pushHumanRouter';
import { initSocketIO } from './socket';

// dotenv.config();

// 1) Emulate __filename and __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for all routes
// app.use(cors());
// Update CORS config
app.use(cors({
  origin: env.server.cors.origin,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

// Serve the React build from "/dist"
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));

// Attach API routes
app.use('/api/stats', customerStatsRouter);
app.use('/api', customerChatsRouter);
app.use('/api', messagesRouter);
app.use('/api', chatStatusRouter);
app.use('/api', pushHumanRouter);

// Fallback route to serve index.html for non-API routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Create an HTTP server from `app`
const server = createServer(app);
console.log("[Server] HTTP server created");

const io = initSocketIO(server);
console.log("[Server] Socket.IO server initialized");

// (Optional) Listen for new client connections
io.on("connection", (socket) => {
  console.log("New Socket.IO client connected:", socket.id);
});

const PORT = env.server.port;

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