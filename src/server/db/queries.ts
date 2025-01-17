import { pool } from './connection';
import { QueryResult, QueryResultRow } from 'pg';

export async function executeQuery<T extends QueryResultRow>(
  query: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const client = await pool.connect();
  try {
    return await client.query(query, params);
  } finally {
    client.release();
  }
}

export const queries = {
  // Users
  getUserByEmail: `
    SELECT * FROM users 
    WHERE email = $1 AND password = $2
  `,
  createUser: `
    INSERT INTO users (email, password, username, full_name, avatar_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `,
  
  // Chats
  getChats: `
    SELECT c.*, 
           json_agg(json_build_object(
             'id', m.id,
             'content', m.content,
             'sender_id', m.sender_id,
             'created_at', m.created_at
           ) ORDER BY m.created_at) as messages
    FROM chats c
    LEFT JOIN messages m ON c.id = m.chat_id
    WHERE c.id IN (
      SELECT chat_id FROM chat_participants WHERE user_id = $1
    )
    GROUP BY c.id
  `,
  addMessage: `
    INSERT INTO messages (chat_id, content, sender_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `
};