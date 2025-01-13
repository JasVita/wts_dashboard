import { useEffect, useState } from "react";
import { NarrowSidebar } from "./components/Navigation/NarrowSidebar";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ChatWindow } from "./components/Chat/ChatWindow";
import { AnalyticsView } from "./components/Analytics/AnalyticsView";
import { DocumentPage } from "./components/Documents/DocumentPage";
import { Chat } from "./types";
import { fetchChats } from "./data/initialData";
import axios from "axios";
import { franc } from "franc";

function App() {
  const [activeView, setActiveView] = useState<"messages" | "analytics" | "documents">("messages");
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
  // const [initialChats, setInitialChats] = useState<Chat[]>([]);
  const [humanChats, setHumanChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await fetchChats();
        // setInitialChats(data);
        setHumanChats(data.filter((chat) => !chat.isAI));
      } catch (error) {
        console.error("Error fetching initial chats:", error);
      }
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

    try {
      const whatsappResponse = await axios.post(
        `https://graph.facebook.com/${import.meta.env.VITE_WHATSAPP_API_VERSION}/${
          import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID
        }/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: selectedChat.wa_id,
          type: "text",
          text: {
            preview_url: true,
            body: message,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      // save real CS reply to DB 
      const now = new Date();
      const offsetTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
      const formattedTime = offsetTime.toISOString().split(".")[0].replace("T", " ");
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/messages/store`, {
        wa_id: selectedChat.wa_id,
        name: selectedChat.name,
        language: franc(message),
        input_time: formattedTime,
        weekday: offsetTime.toLocaleDateString("en-US", { weekday: "long" }),
        conv_mode: `human`,
        response: `${message}`,
      });

      console.log("Message sent successfully:", whatsappResponse.data);

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

      if (selectedChat.isAI) {
        setAiChats(aiChats.map((c) => (c.id === selectedChat.id ? updatedChat : c)));
      } else {
        setHumanChats(humanChats.map((c) => (c.id === selectedChat.id ? updatedChat : c)));
      }
      setSelectedChat(updatedChat);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API responded with an error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
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

  const renderContent = () => {
    switch (activeView) {
      case "messages":
        return (
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
        );
      case "analytics":
        return <AnalyticsView />;
      case "documents":
        return <DocumentPage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <NarrowSidebar activeView={activeView} onViewChange={setActiveView} />
      {renderContent()}
    </div>
  );
}

export default App;