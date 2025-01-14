import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
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

  // ---------------------------
  // AI and Human chats arrays
  // ---------------------------
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
  const [humanChats, setHumanChats] = useState<Chat[]>([]);

  // ---------------------------
  // Selected chat & Socket
  // ---------------------------
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [_socket, setSocket] = useState<Socket | null>(null);

  // ---------------------------
  // Socket.IO Setup & "humanMessage" Handler
  // ---------------------------
  useEffect(() => {
    // 1) Connect to your Node server domain
    const newSocket = io("https://portal.turoid.ai", {
      // If needed, path: "/socket.io", transports: ["websocket"], etc.
    });
    setSocket(newSocket);

    // 2) Listen for connect event
    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server, id:", newSocket.id);
    });

    // 3) Listen for "humanMessage" from Node
    newSocket.on("humanMessage", (data: any) => {
      // Example data structure: { wa_id, name, message_type, message_content, db_time_format, ... }
      console.log("Received humanMessage event:", data);

      // 1) Prepare the new message object
      const incomingMessage = {
        content: data.message_content,
        isUser: true,
        isHuman: true,
        timestamp: new Date(),
        input_type: data.message_type || "text",
      };

      // 2) Check if there's an existing chat with this wa_id in humanChats
      setHumanChats((prevChats) => {
        console.log("Incoming WA ID =>", data.wa_id);
        console.log("Current humanChats' WA IDs =>", prevChats.map((c) => c.wa_id));

        const existingChatIndex = prevChats.findIndex((chat) => chat.wa_id === data.wa_id);
        if (existingChatIndex >= 0) {
          // We found an existing chat
          const updatedMessages = [...prevChats[existingChatIndex].messages, incomingMessage];
          console.log("Found existing chat for wa_id:", prevChats[existingChatIndex].wa_id);

          // The updated chat object
          const updatedChat = {
            ...prevChats[existingChatIndex],
            lastMessage: data.message_content,
            messages: updatedMessages,
          };

          // Return a new array with the updated chat replaced
          const newChats = [...prevChats];
          newChats[existingChatIndex] = updatedChat;
          console.log("Updated existing chat =>", updatedChat);
          // Automatically select this chat if it's not already selected
          // if (!selectedChat || selectedChat.wa_id !== data.wa_id) {
          //   setSelectedChat(updatedChat);
          // }

          // return newChats;
          if (selectedChat?.wa_id === data.wa_id) {
            setSelectedChat(updatedChat);
          }
    
          return newChats;
        } else {
          // 3) If chat not found, create a new one
          console.log("No existing chat found for wa_id:", data.wa_id, " - creating a new chat.");

          const newChat: Chat = {
            wa_id: data.wa_id,
            id: Date.now().toString(), // or some unique ID
            name: data.name,
            avatar: "https://example.com/human.png", // default avatar or your actual user avatar
            isAI: false,
            lastMessage: data.message_content,
            messages: [incomingMessage],
            labels: [],
          };

          console.log("Created new chat =>", newChat);
          // setSelectedChat(newChat);
          return [...prevChats, newChat];
        }
      });
    });

    // Cleanup when component unmounts
    return () => {
      newSocket.close();
    };
  }, []);

  // ---------------------------
  // Initial fetch from DB (if any)
  // ---------------------------
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await fetchChats();
        console.log("fetchChats data:", data);
        // setInitialChats(data);
        setHumanChats(data.filter((chat) => !chat.isAI));
      } catch (error) {
        console.error("Error fetching initial chats:", error);
      }
    };
    fetch();
  }, []);

  // ---------------------------
  // Handler: Switch Chat Status (AI <-> Human)
  // ---------------------------
  const handleStatusChange = (chat: Chat) => {
    if (chat.isAI) {
      // Move from AI to Human
      setAiChats(aiChats.filter((c) => c.id !== chat.id));
      setHumanChats([...humanChats, { ...chat, isAI: false }]);
    } else {
      // Move from Human to AI
      setHumanChats(humanChats.filter((c) => c.id !== chat.id));
      setAiChats([...aiChats, { ...chat, isAI: true }]);
    }
    setSelectedChat(null);
  };

  // ---------------------------
  // Handler: Send a new Message
  // ---------------------------
  const handleSendMessage = async (message: string) => {
    if (!selectedChat) return;

    try {
      // 1) Send the message to WhatsApp
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
      console.log("Message sent successfully to WhatsApp:", whatsappResponse.data);

      // 2) Save real CS reply to DB
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
      console.log("Message saved to DB successfully.");

      // 3) Locally update the selectedChat
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

      // 4) Update the correct array
      if (selectedChat.isAI) {
        setAiChats((prev) => prev.map((c) => (c.id === selectedChat.id ? updatedChat : c)));
      } else {
        setHumanChats((prev) => prev.map((c) => (c.id === selectedChat.id ? updatedChat : c)));
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

  // ---------------------------
  // Handler: Toggle "Important"
  // ---------------------------
  const handleToggleImportant = (chat: Chat) => {
    const updatedChat = { ...chat, isImportant: !chat.isImportant };

    if (chat.isAI) {
      setAiChats((prev) => prev.map((c) => (c.id === chat.id ? updatedChat : c)));
    } else {
      setHumanChats((prev) => prev.map((c) => (c.id === chat.id ? updatedChat : c)));
    }

    setSelectedChat(updatedChat);
  };

  // ---------------------------
  // Render the Main Content
  // ---------------------------
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
