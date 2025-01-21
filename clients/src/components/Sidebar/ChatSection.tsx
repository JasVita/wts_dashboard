import React, { useState } from "react";
import { MessageSquare, ChevronDown, ChevronRight } from "lucide-react";
import { Chat } from "../../types";
import { ChatList } from "./ChatList";

interface ChatSectionProps {
  title: string;
  chats: Chat[];
  isAI: boolean;
  iconColor: string;
  bgColor: string;
  onChatSelect: (chat: Chat) => void;
  onStatusChange: (chat: Chat) => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  title,
  chats,
  isAI,
  iconColor,
  bgColor,
  onChatSelect,
  onStatusChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-4">
      <div className={`flex items-center justify-between p-3 ${bgColor} rounded-lg`}>
        <div className="flex items-center space-x-2">
          <MessageSquare className={`w-5 h-5 ${iconColor}`} />
          <span className={`font-medium ${iconColor}`}>{title}</span>
          <span className="px-2 py-0.5 bg-white bg-opacity-50 rounded-full text-sm">
            {chats.length}
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
        >
          {isExpanded ? (
            <ChevronDown className={`w-4 h-4 ${iconColor}`} />
          ) : (
            <ChevronRight className={`w-4 h-4 ${iconColor}`} />
          )}
        </button>
      </div>
      {isExpanded && (
        <ChatList
          chats={chats}
          isAI={isAI}
          onChatClick={onChatSelect}
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  );
};
