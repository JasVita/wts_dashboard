'use client';
import '@/app/globals.css'; 
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, ChevronDown, ChevronUp, X } from 'lucide-react';
import { UserCog, Bot } from 'lucide-react';
import { Chat, Message } from '@/types/db';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const defaultChat: Chat = {
  id: "1",
  participants: ["1", "2"],
  phoneNumber: "85268712802",
  contactName: "Jas Test",
  contactAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jas",
  createdAt: "2024-01-17T00:00:00.000Z",
  updatedAt: "2024-01-17T00:00:00.000Z",
  type: "human",
  messages: [
    {
      id: "1",
      content: "Hello! How can I help you today? Hello! How can I help you today? Hello! How can I help you today?",
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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'human' | 'ai' | 'label'>('all');
  const [isLabelsExpanded, setIsLabelsExpanded] = useState(true);
  const [labels, setLabels] = useState<Label[]>([
    { id: '1', name: 'label21', color: 'bg-red-100 text-red-800' }
  ]);

  useEffect(() => {
    const loadInitialData = async () => {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        setUserId(user.id);
        try {
          const response = await fetch(`${API_BASE_URL}/chats/${user.id}`);
          const data = await response.json();
          setChats([defaultChat, ...data.chats.map((chat: Chat) => ({ ...chat, type: chat.type || 'human' }))]);
        } catch (error) {
          console.error('Failed to load chats:', error);
          setChats([defaultChat]);
        }
      }
    };

    loadInitialData();
  }, []);

  const formatMessageTime = (timestamp: string) => {
    const date = parseISO(timestamp);
    return format(date, 'HH:mm');
  };

  const toggleChatType = async (chatId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, type: chat.type === 'human' ? 'ai' : 'human' } : chat
      )
    );
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !newMessage.trim() || !userId) return;

    const selectedChatData = chats.find((chat) => chat.id === selectedChat);

    const response = await fetch(`${API_BASE_URL}/chats/${selectedChat}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newMessage,
        senderId: userId,
        phoneNumber: selectedChatData?.phoneNumber,
      }),
    });

    const data = await response.json();

    const updatedChatsResponse = await fetch(`${API_BASE_URL}/chats/${userId}`);
    const updatedChatsData = await updatedChatsResponse.json();
    setChats([defaultChat, ...updatedChatsData.chats]);
    setNewMessage('');
  };
  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'human') return matchesSearch && chat.type === 'human';
    if (activeFilter === 'ai') return matchesSearch && chat.type === 'ai';
    return matchesSearch;
  });

  // Use filteredChats to generate human and AI chat lists
  const humanChats = filteredChats.filter((chat) => chat.type === 'human');
  const aiChats = filteredChats.filter((chat) => chat.type === 'ai');

  // Find the selected chat data
  const selectedChatData = chats.find((chat) => chat.id === selectedChat);

  return (
    <div className="flex flex-1 h-screen">
      {/* Left Sidebar */}
      <div className="flex-shrink-0 w-[350px] bg-white border-r">
        {/* Search Bar */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜尋"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
  
        {/* Filter Tabs */}
        <div className="w-full flex items-center justify-start gap-2 px-2 py-1 bg-white border-b overflow-x-auto">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter('all')}
            className={`h-7 px-3 rounded-full ${
              activeFilter === 'all'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'hover:bg-green-50 text-green-600'
            }`}
          >
            全部 <span>{filteredChats.length}</span>
          </Button>
          <Button
            variant={activeFilter === 'human' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter('human')}
            className={`h-7 px-3 rounded-full ${
              activeFilter === 'human'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'hover:bg-green-50 text-green-600'
            }`}
          >
            人工客服 <span>{humanChats.length}</span>
          </Button>
          <Button
            variant={activeFilter === 'ai' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter('ai')}
            className={`h-7 px-3 rounded-full ${
              activeFilter === 'ai'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'hover:bg-green-50 text-green-600'
            }`}
          >
            AI客服 <span>{aiChats.length}</span>
          </Button>
          <Button
            variant={activeFilter === 'label' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter('label')}
            className={`h-7 px-3 rounded-full ${
              activeFilter === 'label'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'hover:bg-green-50 text-green-600'
            }`}
          >
            標籤 <span>{labels.length}</span>
          </Button>
        </div>
  
        {/* Labels Section */}
        <div className="border-b">
          <div className="p-2 flex justify-between items-center">
            <button
              onClick={() => setIsLabelsExpanded(!isLabelsExpanded)}
              className="flex items-center text-sm font-medium text-gray-700"
            >
              {isLabelsExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
              標籤
            </button>
            <Button variant="ghost" size="sm" className="p-1 h-6">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {isLabelsExpanded && (
            <div className="p-2 space-y-2">
              {labels.map((label) => (
                <div key={label.id} className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${label.color}`}
                  >
                    {label.name}
                  </span>
                  <Button variant="ghost" size="sm" className="p-1 h-6">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
  
        {/* Chat List */}
        <ScrollArea className="h-screen">
          <div className="w-[350px] border-b">
            <div className="p-4 bg-green-50 flex items-center space-x-2">
              <UserCog className="w-5 h-5 text-green-600" />
              <h2 className="font-medium text-green-800">人工客服</h2>
              <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">
                {humanChats.length}
              </span>
            </div>
            {humanChats.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 hover:bg-gray-100 cursor-pointer ${
                  selectedChat === chat.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-3 py-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChatType(chat.id);
                    }}
                  >
                    轉AI
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
  
      {/* Right Section */}
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
                  <h2 className="font-medium">
                    {selectedChatData?.contactName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    +{selectedChatData?.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedChatData?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === userId ? 'justify-end' : 'justify-start'
                    }`}
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