// import { executeQuery } from './connection';

// export const dbOperations = {
//   getUser: async (email: string, password: string) => {
//     const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
//     return await executeQuery(query, [email, password]);
//   },
//   createUser: async (data: { email: string; password: string; username: string; fullName: string }) => {
//     const query =
//       'INSERT INTO users (email, password, username, full_name) VALUES ($1, $2, $3, $4) RETURNING *';
//     return await executeQuery(query, [data.email, data.password, data.username, data.fullName]);
//   },
//   getChats: async (userId: string) => {
//     const query = 'SELECT * FROM chats WHERE user_id = $1';
//     return await executeQuery(query, [userId]);
//   },
//   addMessage: async (chatId: string, content: string, senderId: string) => {
//     const query =
//       'INSERT INTO messages (chat_id, content, sender_id) VALUES ($1, $2, $3) RETURNING *';
//     return await executeQuery(query, [chatId, content, senderId]);
//   },
// };



// import { executeQuery, queries } from './queries';
// import { User, Chat, Message } from '../../types/db';

// export const dbOperations = {
//   async getUser(email: string, password: string): Promise<User | null> {
//     const result = await executeQuery<User>(queries.getUserByEmail, [email, password]);
//     return result.rows[0] || null;
//   },

//   async createUser(user: Omit<User, 'id' | 'avatarUrl'>): Promise<User> {
//     const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;
//     const result = await executeQuery<User>(queries.createUser, [
//       user.email,
//       user.password,
//       user.username,
//       user.fullName,
//       avatarUrl
//     ]);
//     return result.rows[0];
//   },

//   async getChats(userId: string): Promise<Chat[]> {
//     const result = await executeQuery<Chat>(queries.getChats, [userId]);
//     return result.rows;
//   },

//   async addMessage(chatId: string, content: string, senderId: string): Promise<Message> {
//     const result = await executeQuery<Message>(queries.addMessage, [chatId, content, senderId]);
//     return result.rows[0];
//   }
// };