import { useEffect, useState } from "react";
import { NarrowSidebar } from "./components/Navigation/NarrowSidebar";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ChatWindow } from "./components/Chat/ChatWindow";
import { AnalyticsView } from "./components/Analytics/AnalyticsView";
import { DocumentPage } from "./components/Documents/DocumentPage";
import { Chat } from "./types";
import { fetchChats } from "./data/initialData";
import { initSocket, cleanupSocket } from "./lib/socketHandler";
import { sendMessageToWhatsApp, saveReplyToDB, getTuroidChat } from "./services/whatsappAPI";
import { franc } from "franc";

function App() {
  const [activeView, setActiveView] = useState<"messages" | "analytics" | "documents">("messages");
  const [aiChats, setAiChats] = useState<Chat[]>([getTuroidChat()]);
  const [humanChats, setHumanChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => {
    const handleHumanMessage = (data: any) => {
      const incomingMessage = {
        content: data.message_content,
        isUser: true,
        isHuman: true,
        timestamp: new Date(data.db_time_format),
        input_type: data.message_type || "text",
      };

      setHumanChats((prevChats) => {
        const existingChatIndex = prevChats.findIndex((chat) => chat.wa_id === data.wa_id);

        if (existingChatIndex >= 0) {
          const updatedChat = {
            ...prevChats[existingChatIndex],
            lastMessage: data.message_content,
            messages: [...prevChats[existingChatIndex].messages, incomingMessage],
          };

          const newChats = [...prevChats];
          newChats[existingChatIndex] = updatedChat;

          if (selectedChat?.wa_id === data.wa_id) {
            setSelectedChat(updatedChat);
          }

          return newChats;
        } else {
          const newChat: Chat = {
            wa_id: data.wa_id,
            id: Date.now().toString(),
            name: data.name,
            avatar: "https://example.com/human.png",
            isAI: false,
            lastMessage: data.message_content,
            messages: [incomingMessage],
            labels: [],
          };

          if (!selectedChat) {
            setSelectedChat(newChat);
          }

          return [...prevChats, newChat];
        }
      });
    };

    initSocket(handleHumanMessage);

    return () => {
      cleanupSocket();
    };
  }, [selectedChat]);

  // Preserved initial fetch
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await fetchChats();
        setHumanChats(data.filter(chat => !chat.isAI));
        setAiChats(prevAiChats => {
          const fetchedAiChats = data.filter(chat => chat.isAI);
          const uniqueChats = fetchedAiChats.filter(
            chat => !prevAiChats.some(prevChat => prevChat.id === chat.id)
          );
          return [...prevAiChats, ...uniqueChats];
        });
      } catch (error) {
        console.error("Error fetching initial chats:", error);
      }
    };
    fetch();
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!selectedChat) return;

    try {
      // Send message to WhatsApp
      await sendMessageToWhatsApp(selectedChat.wa_id, message);

      // Save reply to DB
      const language = franc(message);
      await saveReplyToDB(selectedChat.wa_id, selectedChat.name, message, language);

      // Update UI
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
      console.error("[App] Failed to send message or save reply:", error);
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