"use client";
import React, { useState, useRef, useEffect } from "react";
import { FileText, Image, Mic, Languages, Paperclip, Send, X } from "lucide-react";
import { GPTModelSelect } from "./GPTModelSelect";
import { FileUpload } from "./FileUpload";
import { ChatMessage } from "./ChatMessage";
import { LanguageSelector } from "./LanguageSelector";

interface ChatMessageType {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const DocumentPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [showLanguages, setShowLanguages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (newFiles: FileList) => {
    setFiles((prev) => [...prev, ...Array.from(newFiles)]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = [
        "I've analyzed the documents and here's what I found...",
        "Based on the provided information...",
        "Let me help you understand this better...",
        "According to the documents...",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const aiMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content: `${randomResponse} (In response to: "${message}")`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);

    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-1 h-screen">
      {/* Left Panel */}
      <div className="w-96 border-r bg-white flex flex-col h-full">
        <div className="p-4 flex flex-col flex-1">
          <GPTModelSelect />

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {files.length} document{files.length !== 1 ? "s" : ""} uploaded
            </p>
          </div>

          <FileUpload onFileUpload={handleFileUpload} />

          <div className="mt-4 flex-1 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-lg group">
                <FileText className="w-5 h-5 text-gray-400 mr-2" />
                <span className="flex-1 truncate text-sm">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="flex-1 flex flex-col bg-gray-50 h-full">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-white relative">
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Image className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            <button
              className={`p-2 hover:bg-gray-100 rounded-full ${
                isRecording ? "bg-red-50 text-red-500" : "text-gray-500"
              }`}
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                onClick={() => setShowLanguages(!showLanguages)}
              >
                <Languages className="w-5 h-5" />
              </button>
              {showLanguages && (
                <LanguageSelector
                  onSelect={(lang) => {
                    console.log("Selected language:", lang);
                    setShowLanguages(false);
                  }}
                />
              )}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
