'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Chat, Message } from '@/types/db';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const defaultChat = {
  id: "1",
  participants: ["1", "2"],
  phoneNumber: "85268712802",
  contactName: "Jas Test",
  contactAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jas",
  createdAt: "2024-01-17T00:00:00.000Z",
  updatedAt: "2024-01-17T00:00:00.000Z",
  messages: [
    {
      id: "1",
      content: "Hello! How can I help you today?",
      senderId: "1",
      createdAt: "2024-01-17T00:00:00.000Z"
    }
  ]
};

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([defaultChat]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState<string>(defaultChat.id);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      const response = await fetch(`${API_BASE_URL}/auth/current`);
      const data = await response.json();
      if (data.user) {
        setUserId(data.user.id);
        const chatsResponse = await fetch(`${API_BASE_URL}/chats/${data.user.id}`);
        const chatsData = await chatsResponse.json();
        setChats([defaultChat, ...chatsData.chats]);
      }
    };

    loadInitialData();
  }, []);

  const formatMessageTime = (timestamp: string) => {
    const date = parseISO(timestamp);
    return format(date, 'HH:mm');
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !newMessage.trim() || !userId) return;

    const selectedChatData = chats.find(chat => chat.id === selectedChat);
    
    const response = await fetch(`${API_BASE_URL}/chats/${selectedChat}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newMessage,
        senderId: userId,
        phoneNumber: selectedChatData?.phoneNumber
      })
    });

    const data = await response.json();
    
    const updatedChatsResponse = await fetch(`${API_BASE_URL}/chats/${userId}`);
    const updatedChatsData = await updatedChatsResponse.json();
    setChats([defaultChat, ...updatedChatsData.chats]);
    setNewMessage('');
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  return (
    <div className="flex flex-1">
      <div className="w-80 bg-white border-r">
        <ScrollArea className="h-screen">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 hover:bg-gray-100 cursor-pointer ${
                selectedChat === chat.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={chat.contactAvatar} />
                  <AvatarFallback>
                    {chat.contactName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.contactName}
                  </p>
                  {chat.messages[chat.messages.length - 1] && (
                    <p className="text-sm text-gray-500 truncate">
                      {chat.messages[chat.messages.length - 1].content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b bg-white">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={selectedChatData?.contactAvatar} />
                  <AvatarFallback>
                    {selectedChatData?.contactName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{selectedChatData?.contactName}</h2>
                  <p className="text-sm text-gray-500">+{selectedChatData?.phoneNumber}</p>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedChatData?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === userId
                          ? 'bg-green-500 text-white'
                          : 'bg-white border'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {formatMessageTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <form
              onSubmit={sendMessage}
              className="p-4 border-t bg-white flex space-x-2"
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit">Send</Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}