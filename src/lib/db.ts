import { User, Message, Chat } from '@/types/db';

const getLocalStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
};

const getInitialUsers = (): User[] => [
  {
    id: "1",
    email: "demo@example.com",
    password: "password123",
    username: "demo",
    fullName: "Demo User",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo"
  }
];

const getInitialChats = (): Chat[] => [
  {
    id: "1",
    participants: ["1", "2"],
    createdAt: "2024-01-17T00:00:00.000Z",
    updatedAt: "2024-01-17T00:00:00.000Z",
    messages: [
      {
        id: "1",
        content: "Hello!",
        senderId: "1",
        createdAt: "2024-01-17T00:00:00.000Z"
      }
    ]
  }
];

export const db = {
  async getUser(email: string, password: string): Promise<User | null> {
    const storage = getLocalStorage();
    const users = storage ? JSON.parse(storage.getItem('users') || JSON.stringify(getInitialUsers())) : getInitialUsers();
    const user = users.find((user: User) => user.email === email && user.password === password) || null;
    
    if (user) {
      storage?.setItem('currentUser', JSON.stringify(user));
    }
    
    return user;
  },

  async getCurrentUser(): Promise<User | null> {
    const storage = getLocalStorage();
    const currentUser = storage?.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  },

  async createUser(user: Omit<User, 'id' | 'avatarUrl'>): Promise<User> {
    const storage = getLocalStorage();
    const users = storage ? JSON.parse(storage.getItem('users') || JSON.stringify(getInitialUsers())) : getInitialUsers();
    const newUser = {
      ...user,
      id: String(users.length + 1),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
    };
    users.push(newUser);
    storage?.setItem('users', JSON.stringify(users));
    storage?.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  },

  async signOut() {
    const storage = getLocalStorage();
    storage?.removeItem('currentUser');
  },

  async getChats(userId: string): Promise<Chat[]> {
    const storage = getLocalStorage();
    const chats = storage ? JSON.parse(storage.getItem('chats') || JSON.stringify(getInitialChats())) : getInitialChats();
    return chats.filter((chat: Chat) => chat.participants.includes(userId));
  },

  async addMessage(chatId: string, message: Omit<Message, 'id' | 'createdAt'>): Promise<Message> {
    const storage = getLocalStorage();
    const chats = storage ? JSON.parse(storage.getItem('chats') || JSON.stringify(getInitialChats())) : getInitialChats();
    const chat = chats.find((c: Chat) => c.id === chatId);
    if (!chat) throw new Error('Chat not found');

    const newMessage = {
      ...message,
      id: String(chat.messages.length + 1),
      createdAt: new Date().toISOString()
    };
    chat.messages.push(newMessage);
    chat.updatedAt = new Date().toISOString();
    storage?.setItem('chats', JSON.stringify(chats));
    return newMessage;
  }
};