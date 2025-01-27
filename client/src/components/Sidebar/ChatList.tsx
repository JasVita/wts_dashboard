import React, { useEffect, useState } from "react";
import { Circle, Star } from "lucide-react";
import { Chat } from "../../types";

interface ChatListProps {
  chats: Chat[];
  isAI: boolean;
  onChatClick: (chat: Chat) => void;
  onStatusChange: (chat: Chat) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ chats, isAI, onChatClick, onStatusChange }) => {
  const [localLabels, setLocalLabels] = useState<{ [chatId: string]: Chat["labels"] }>({});

  useEffect(() => {
    // Initialize local labels for each chat
    const initialLabels = chats.reduce((acc, chat) => {
      acc[chat.id] = chat.labels || [];
      return acc;
    }, {} as { [chatId: string]: Chat["labels"] });
    setLocalLabels(initialLabels);
  }, [chats]);

  return (
    <div className="flex flex-col space-y-1 mt-2">
      {chats.map((chat) => {
        const labels = localLabels[chat.id] || [];

        return (
          <div
            key={chat.id}
            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
            onClick={() => onChatClick(chat)}
          >
            <div className="flex-shrink-0 relative">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
              </div>
              {chat.isImportant && (
                <Star className="w-4 h-4 absolute -top-1 -right-1 text-yellow-500 fill-current" />
              )}
            </div>
            <div className="ml-3 flex-1 min-w-0 flex-row relative">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm text-gray-900">{chat.name}</h3>

                {/* Display the first two labels and append "..." if there are more */}
                {labels.slice(0, 2).map((label) => (
                  <div
                    key={label.id}
                    className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${label.color.replace(
                      "bg-",
                      "bg-opacity-20 "
                    )} border border-opacity-20 ${label.color}`}
                  >
                    <span className={`text-xs font-medium ${label.color.replace("bg-", "text-")}`}>
                      {label.name}
                    </span>
                  </div>
                ))}
                {labels.length > 2 && (
                  <span className="text-xs text-gray-500 font-medium">...</span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              {chat.unread && (
                <Circle
                  className="text-green-500 absolute right-0 top-3"
                  fill="currentColor"
                  width={12}
                  height={12}
                />
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(chat);
              }}
              className={`ml-2 px-4 h-8 text-white text-sm font-medium rounded-full transition-colors ${
                isAI ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isAI ? "轉人工" : "轉AI"}
            </button>
          </div>
        );
      })}
    </div>
  );
};
