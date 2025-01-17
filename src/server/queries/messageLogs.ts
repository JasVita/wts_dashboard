import { pool } from '../db/index';

export const storeMessage = async (messageData: {
  wa_id: string;
  content: string;
  timestamp: string;
  isAI: boolean;
}) => {
  const { wa_id, content, timestamp, isAI } = messageData;

  try {
    const query = `
      INSERT INTO messages (wa_id, content, timestamp, is_ai)
      VALUES ($1, $2, $3, $4)
    `;

    await pool.query(query, [wa_id, content, timestamp, isAI]);
  } catch (error) {
    console.error('[MessageLogs] Error storing message:', error);
    throw new Error('Failed to store message');
  }
};

export const fetchMessagesByChatId = async (chatId: string) => {
  try {
    const query = `
      SELECT * 
      FROM messages
      WHERE wa_id = $1
      ORDER BY timestamp ASC
    `;

    const result = await pool.query(query, [chatId]);
    return result.rows;
  } catch (error) {
    console.error('[MessageLogs] Error fetching messages:', error);
    throw new Error('Failed to fetch messages');
  }
};
