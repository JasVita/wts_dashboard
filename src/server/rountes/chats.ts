import express, { Request, Response, Router } from 'express';
import { dbOperations } from '../db/operations';

export const router: Router = express.Router();

interface MessageRequest {
  content: string;
  senderId: string;
}

router.get('/:userId', async (req: Request<{ userId: string }>, res: Response) => {
  const { userId } = req.params;
  try {
    const chats = await dbOperations.getChats(userId);
    res.json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:chatId/messages', async (req: Request<{ chatId: string }, {}, MessageRequest>, res: Response) => {
  const { chatId } = req.params;
  const { content, senderId } = req.body;
  try {
    const message = await dbOperations.addMessage(chatId, content, senderId);
    res.json({ message });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});