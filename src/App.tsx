import React, { useEffect, useState } from "react";
import { NarrowSidebar } from "./components/Navigation/NarrowSidebar";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ChatWindow } from "./components/Chat/ChatWindow";
import { AnalyticsView } from "./components/Analytics/AnalyticsView";
import { Chat } from "./types";
import { fetchChats } from "./data/initialData";
import axios from "axios";

function App() {
  const [activeView, setActiveView] = useState<"messages" | "analytics">("messages");
  const [aiChats, setAiChats] = useState<Chat[]>([
    {
      wa_id: "turoid",
      id: "ai-1",
      name: "Turoid",
      avatar: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&h=400&fit=crop",
      isAI: true,
      lastMessage: "你好！我是 Turoid，請問有什麼可以幫到你？",
      messages: [
        {
          content: "你好！我是 Turoid，請問有什麼可以幫到你？",
          isUser: false,
          timestamp: new Date(),
          input_type: "text",
        },
      ],
      labels: [],
    },
  ]);
  const [initialChats, setInitialChats] = useState<Chat[]>([]); // Add state for initial chats

  const [humanChats, setHumanChats] = useState<Chat[]>(initialChats.filter((chat) => !chat.isAI));

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchChats();
      setInitialChats(data);
      setHumanChats(data.filter((chat) => !chat.isAI));
    };
    fetch();
  }, []);

  const handleStatusChange = (chat: Chat) => {
    if (chat.isAI) {
      setAiChats(aiChats.filter((c) => c.id !== chat.id));
      setHumanChats([...humanChats, { ...chat, isAI: false }]);
    } else {
      setHumanChats(humanChats.filter((c) => c.id !== chat.id));
      setAiChats([...aiChats, { ...chat, isAI: true }]);
    }
    setSelectedChat(null);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedChat) return;

    const newMessage = {
      content: message,
      isUser: false,
      isHuman: true,
      timestamp: new Date(),
    };

    const updatedChat = {
      ...selectedChat,
      lastMessage: message,
      messages: [...selectedChat.messages, newMessage],
    };

    // make an API request

    // Step 1: Send the message via WhatsApp API
    const whatsappResponse = await axios.post("http://localhost:3000/api/whatsapp/sendMessage", {
      chatId: selectedChat.id,
      message: message,
    });

    const isSuccess = whatsappResponse.status === 200;

    // Step 2: Store the message and API response in the database
    await axios.post("http://localhost:3000/api/messages/store", {
      chatId: selectedChat.id,
      message: {
        content: message,
        isUser: false,
        isHuman: true,
        timestamp: new Date(),
        status: isSuccess ? "sent" : "failed",
        response: whatsappResponse.data,
      },
    });

    if (selectedChat.isAI) {
      setAiChats(aiChats.map((c) => (c.id === selectedChat.id ? updatedChat : c)));
    } else {
      setHumanChats(humanChats.map((c) => (c.id === selectedChat.id ? updatedChat : c)));
    }
    setSelectedChat(updatedChat);
  };

  const handleToggleImportant = (chat: Chat) => {
    const updatedChat = { ...chat, isImportant: !chat.isImportant };

    if (chat.isAI) {
      setAiChats(aiChats.map((c) => (c.id === chat.id ? updatedChat : c)));
    } else {
      setHumanChats(humanChats.map((c) => (c.id === chat.id ? updatedChat : c)));
    }

    setSelectedChat(updatedChat);
  };
  return (
    <div className="flex h-screen bg-gray-100">
      <NarrowSidebar activeView={activeView} onViewChange={setActiveView} />
      {activeView === "messages" ? (
        <>
          <Sidebar
            aiChats={aiChats}
            humanChats={humanChats}
            onChatSelect={setSelectedChat}
            onStatusChange={handleStatusChange}
          />
          <ChatWindow
            chat={selectedChat}
            onBack={() => setSelectedChat(null)}
            onSendMessage={handleSendMessage}
            onStatusChange={handleStatusChange}
            onToggleImportant={handleToggleImportant}
          />
        </>
      ) : (
        <AnalyticsView />
      )}
    </div>
  );
}

export default App;
