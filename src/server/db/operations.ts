import { executeQuery, queries } from './queries';
import { User, Chat, Message } from '../../types/db';

export const dbOperations = {
  async getUser(email: string, password: string): Promise<User | null> {
    const result = await executeQuery<User>(queries.getUserByEmail, [email, password]);
    return result.rows[0] || null;
  },

  async createUser(user: Omit<User, 'id' | 'avatarUrl'>): Promise<User> {
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;
    const result = await executeQuery<User>(queries.createUser, [
      user.email,
      user.password,
      user.username,
      user.fullName,
      avatarUrl
    ]);
    return result.rows[0];
  },

  async getChats(userId: string): Promise<Chat[]> {
    const result = await executeQuery<Chat>(queries.getChats, [userId]);
    return result.rows;
  },

  async addMessage(chatId: string, content: string, senderId: string): Promise<Message> {
    const result = await executeQuery<Message>(queries.addMessage, [chatId, content, senderId]);
    return result.rows[0];
  }
};