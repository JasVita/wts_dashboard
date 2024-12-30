import React from 'react';
import { Chat } from '../../types';
import { Star } from 'lucide-react';
import { INTERFACE_TEXT } from '../../constants/labels';

interface ChatListProps {
  chats: Chat[];
  isAI: boolean;
  onChatClick: (chat: Chat) => void;
  onStatusChange: (chat: Chat) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ chats, isAI, onChatClick, onStatusChange }) => {
  return (
    <div className="flex flex-col space-y-1 mt-2">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
          onClick={() => onChatClick(chat)}
        >
          <div className="flex-shrink-0 relative">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-full h-full object-cover"
              />
            </div>
            {chat.isImportant && (
              <Star className="w-4 h-4 absolute -top-1 -right-1 text-yellow-500 fill-current" />
            )}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm text-gray-900">{chat.name}</h3>
              {chat.isImportant && (
                <span className="text-xs text-yellow-500 font-medium">重要對話</span>
              )}
              {chat.labels?.map((label) => (
                <div
                  key={label.id}
                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${label.color.replace('bg-', 'bg-opacity-20 ')} border border-opacity-20 ${label.color}`}
                >
                  <span className={`text-xs font-medium ${label.color.replace('bg-', 'text-')}`}>
                    {label.name}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(chat);
            }}
            className={`ml-2 px-4 h-8 text-white text-sm font-medium rounded-full transition-colors flex items-center justify-center ${
              isAI
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isAI ? INTERFACE_TEXT.ACTIONS.TO_HUMAN : INTERFACE_TEXT.ACTIONS.TO_AI}
          </button>
        </div>
      ))}
    </div>
  );
}