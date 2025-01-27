"use client";
// need daily_message, customerlist tables
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { ChatWindow } from "../../components/Chat/ChatWindow";
import { Chat } from "../../types";
import { fetchChats } from "../../data/initialData";
import axios from "axios";
import { franc } from "franc";

// const socket = io("http://localhost:5000");

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
      unread: false,
    },
  ]);
  const [humanChats, setHumanChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const selectedChatRef = useRef(selectedChat);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // ---------------------------
  // Socket.IO Setup & "humanMessage" Handler
  // ---------------------------

  useEffect(() => {
    const socket = io("http://localhost:5000");

    const handleIncomingMessage = async ({
      wa_id,
      message_type,
      message_content,
      reply_content,
      managed,
      name,
    }: {
      wa_id: string;
      message_type: string;
      message_content: string;
      reply_content: string;
      managed: string;
      name: string;
    }) => {
      console.log("app is calling this function");
      if (!wa_id || !message_type || !message_content) {
        console.error("Invalid message data received");
        return;
      }
      console.log(
        `Message received, wa_id: ${wa_id}, message_type: ${message_type}, message_content: ${message_content}, managed: ${managed}`
      );

      const newMessage = {
        content: message_content,
        isUser: true,
        timestamp: new Date(),
        input_type: message_type,
      };
      const newReply = {
        content: reply_content,
        isUser: false,
        timestamp: new Date(),
        input_type: message_type,
      };

      if (managed === "human") {
        setHumanChats((prevChats) => {
          const updatedChats = prevChats.map((chat) =>
            chat.wa_id === wa_id
              ? {
                  ...chat,
                  lastMessage: newMessage.content, // Update lastMessage
                  messages: [...chat.messages, newMessage], // Append the new message to messages array
                  unread: selectedChatRef.current?.wa_id !== wa_id,
                }
              : chat
          );
          return updatedChats;
        });

        if (selectedChatRef.current && selectedChatRef.current.wa_id === wa_id) {
          const updatedSelectedChat = {
            ...selectedChat,
            lastMessage: newMessage.content,
            messages: [...selectedChatRef.current.messages, newMessage],
          };
          // @ts-ignore
          setSelectedChat(updatedSelectedChat);
        }

        const now = new Date();
        const offsetTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        const formattedTime = offsetTime.toISOString().split(".")[0].replace("T", " ");
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages/store`, {
          wa_id: wa_id,
          name: name,
          language: franc(message_content),
          input_time: formattedTime,
          weekday: offsetTime.toLocaleDateString("en-US", { weekday: "long" }),
          conv_mode: `human`,
          input_content: message_content,
          response: "",
        });
        console.log("Message saved to DB successfully.");
        return;
      }

      if (managed === "ai") {
        setAiChats((prevChats) => {
          const updatedChats = prevChats.map((chat) =>
            chat.wa_id === wa_id
              ? {
                  ...chat,
                  lastMessage: newReply.content, // Update lastMessage
                  messages: [...chat.messages, newMessage, newReply], // Append the new message to messages array
                  unread: selectedChatRef.current?.wa_id !== wa_id,
                }
              : chat
          );
          return updatedChats;
        });

        if (selectedChatRef.current && selectedChatRef.current.wa_id === wa_id) {
          const updatedSelectedChat = {
            ...selectedChat,
            lastMessage: newReply.content,
            messages: [...selectedChatRef.current.messages, newMessage, newReply],
          };
          // @ts-ignore
          setSelectedChat(updatedSelectedChat);
        }

        const now = new Date();
        const offsetTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        const formattedTime = offsetTime.toISOString().split(".")[0].replace("T", " ");
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages/store`, {
          wa_id: wa_id,
          name: name,
          language: franc(message_content),
          input_time: formattedTime,
          weekday: offsetTime.toLocaleDateString("en-US", { weekday: "long" }),
          conv_mode: "AI",
          input_content: message_content,
          response: reply_content,
        });
        console.log("Message saved to DB successfully.");
        return;
      }

      const newChat: Chat = {
        wa_id,
        id: Date.now().toString(), // need to figure out later
        name: name,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop", // Default avatar
        isAI: true,
        lastMessage: newReply.content,
        messages: [newMessage, newReply],
        labels: [],
        isImportant: false,
        unread: selectedChatRef.current?.wa_id !== wa_id,
      };

      // const updatedAiChats = [...aiChats, newChat];
      // setAiChats(updatedAiChats);

      setAiChats((prevAiChats) => {
        return [...prevAiChats, newChat];
      });
    };

    // Register the listener
    socket.on("humanMessage", handleIncomingMessage);

    // Cleanup the listener on unmount
    return () => {
      socket.off("humanMessage", handleIncomingMessage);
    };
  }, []); // Ensure this only runs once

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
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages/store`, {
        wa_id: selectedChat.wa_id,
        name: selectedChat.name,
        language: franc(message),
        input_time: formattedTime,
        weekday: offsetTime.toLocaleDateString("en-US", { weekday: "long" }),
        conv_mode: `human`,
        response: message,
        isReply: true,
      });
      console.log("Reply saved to DB successfully.");

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

  // ---------------------------
  // Handler: Chat select
  // ---------------------------
  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);

    if (chat.isAI) {
      setAiChats((prevChats) =>
        prevChats.map((c) =>
          c.id === chat.id
            ? {
                ...c,
                unread: false, // Mark as read when chat is opened
              }
            : c
        )
      );
    } else {
      setHumanChats((prevChats) =>
        prevChats.map((c) =>
          c.id === chat.id
            ? {
                ...c,
                unread: false, // Mark as read when chat is opened
              }
            : c
        )
      );
    }
  };

  return (
    <div className="flex">
      <Sidebar
        aiChats={aiChats}
        humanChats={humanChats}
        onChatSelect={handleChatSelect}
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
