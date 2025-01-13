import path from "path";
import { fileURLToPath } from "url";

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import API routes
import { customerStatsRouter } from './routes/customerStats';
import { customerChatsRouter } from './routes/customerChats';
import { messagesRouter } from './routes/messages';
import { chatStatusRouter } from './routes/chatStatus';

dotenv.config();

// 1) Emulate __filename and __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// 2) Serve the React build from "/dist"
const distPath = path.join(__dirname, "../../dist");
app.use(express.static(distPath));

// 3) Attach your API routes
app.use('/api/stats', customerStatsRouter);
app.use('/api', customerChatsRouter);
app.use('/api', messagesRouter);
app.use('/api', chatStatusRouter);

// 4) Fallback route to serve index.html for any non-API route
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// 5) Listen on port 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});