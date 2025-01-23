"use client";
// need daily_message, customerlist tables
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { ChatWindow } from "../../components/Chat/ChatWindow";
import { Chat } from "../../types";
import { fetchChats } from "../../data/initialData";
import axios from "axios";
import { franc } from "franc";

const socket = io("http://localhost:5000");

function App() {
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

  // ---------------------------
  // Socket.IO Setup & "humanMessage" Handler
  // ---------------------------

  // Receiving messages from clients with socket
  socket.on("humanMessage", ({ wa_id, message_type, message_content }) => {
    console.log(
      `Message from pushHuman router, wa_id: ${wa_id}, name: ${name}, message_type: ${message_type}, message_content: ${message_content}`
    );

    // Define the new message
    const newMessage = {
      content: message_content,
      isUser: true,
      timestamp: new Date(),
      input_type: message_type,
    };

    let isAI = undefined;
    if (!isAI) console.log("lol");
    const updatedChats = humanChats.map((chat) =>
      chat.wa_id == wa_id
        ? {
            ...chat,
            lastMessage: newMessage.content, // Update lastMessage
            messages: [...chat.messages, newMessage], // Append the new message to messages array
          }
        : chat
    );
    // Set the updated chats to state
    setHumanChats(updatedChats);
  });

  // ---------------------------
  // Initial fetch from DB (if any)
  // ---------------------------
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await fetchChats();
        // setInitialChats(data);
        setHumanChats(data.filter((chat) => !chat.isAI));
        // Merge the default AI chat with fetched AI chats
        setAiChats((prevAiChats) => {
          const fetchedAiChats = data.filter((chat) => chat.isAI);

          // Filter out duplicates to ensure the default chat is not added again
          const uniqueChats = fetchedAiChats.filter(
            (chat) => !prevAiChats.some((prevChat) => prevChat.id === chat.id)
          );

          // Combine the default chat and unique fetched chats
          return [...prevAiChats, ...uniqueChats];
        });
      } catch (error) {
        console.error("Error fetching initial chats:", error);
      }
    };
    fetch();
  }, []);

  // ---------------------------
  // Handler: Switch Chat Status (AI <-> Human)
  // ---------------------------
  const handleStatusChange = async (chat: Chat) => {
    await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/customers/toggleConvMode`, {
      wa_id: chat.wa_id,
      isAI: !chat.isAI,
    });

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
        `https://graph.facebook.com/${process.env.NEXT_PUBLIC_WHATSAPP_API_VERSION}/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER_ID}/messages`,
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
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_WHATSAPP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Message sent successfully to WhatsApp:", whatsappResponse.data);

      // 2) Save real CS reply to DB
      const now = new Date();
      const offsetTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
      const formattedTime = offsetTime.toISOString().split(".")[0].replace("T", " ");
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/push-adminToDB`, {
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
  const handleToggleImportant = async (chat: Chat) => {
    const updatedChat = { ...chat, isImportant: !chat.isImportant };

    await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/customers/toggleImportance`, {
      wa_id: chat.wa_id,
      importance: updatedChat.isImportant,
    });

    if (chat.isAI) {
      setAiChats((prev) => prev.map((c) => (c.id === chat.id ? updatedChat : c)));
    } else {
      setHumanChats((prev) => prev.map((c) => (c.id === chat.id ? updatedChat : c)));
    }

    setSelectedChat(updatedChat);
  };

  return (
    <div className="flex">
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
    </div>
  );
}

export default App;
