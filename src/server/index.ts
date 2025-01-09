import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { customerStatsRouter } from './routes/customerStats';
import { customerChatsRouter } from './routes/customerChats';
import { messagesRouter } from './routes/messages';
import { chatStatusRouter } from './routes/chatStatus';

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});