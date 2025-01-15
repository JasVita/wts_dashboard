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
<<<<<<< Updated upstream
=======
  
  // Preserved Turoid AI chat initialization
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  const [initialChats, setInitialChats] = useState<Chat[]>([]);
=======

>>>>>>> Stashed changes
  const [humanChats, setHumanChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

<<<<<<< Updated upstream
=======
  // ---------------------------
  // Socket.IO Setup & "humanMessage" Handler
  // ---------------------------
  useEffect(() => {
    // const socketUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
    const socketUrl = 'https://api.turoid.ai'; // Direct URL, not from env
    console.log("[App] Connecting to socket URL:", socketUrl);
    // console.log("[App] Socket URL:", socketUrl);

    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      path: '/socket.io', // Add explicit path
      withCredentials: true
    });

    
    newSocket.on("connect", () => {
      console.log("[App] Step 2 - Socket connected, ID:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("[App] Socket disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("[App] Socket connection error:", error);
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server, id:", newSocket.id);
    });

    newSocket.on("humanMessage", (data: any) => {
      console.log("Received humanMessage event:", data);

      const incomingMessage = {
        content: data.message_content,
        isUser: true,
        isHuman: true,
        timestamp: new Date(data.db_time_format),
        input_type: data.message_type || "text",
      };

      setHumanChats(prevChats => {
        console.log("Incoming WA ID =>", data.wa_id);
        console.log(
          "Current humanChats' WA IDs =>",
          prevChats.map((c) => c.wa_id)
        );
        console.log("[App] Step 3 - Received humanMessage:", data);
        const existingChatIndex = prevChats.findIndex(chat => chat.wa_id === data.wa_id);
        
        if (existingChatIndex >= 0) {
          // Update existing chat
          console.log("[App] Step 4 - Updating chats, current chats:", prevChats);
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

          // Auto-select new chat if none selected
          if (!selectedChat) {
            setSelectedChat(newChat);
          }

          return [...prevChats, newChat];
        }
      });
    });

    return () => {
      newSocket.close();
    };
  }, [selectedChat]);

  // Preserved initial fetch
>>>>>>> Stashed changes
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await fetchChats();
<<<<<<< Updated upstream
        setInitialChats(data);
        setHumanChats(data.filter((chat) => !chat.isAI));
=======
        setHumanChats(data.filter(chat => !chat.isAI));
        setAiChats(prevAiChats => {
          const fetchedAiChats = data.filter(chat => chat.isAI);
          const uniqueChats = fetchedAiChats.filter(
            chat => !prevAiChats.some(prevChat => prevChat.id === chat.id)
          );
          return [...prevAiChats, ...uniqueChats];
        });
>>>>>>> Stashed changes
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