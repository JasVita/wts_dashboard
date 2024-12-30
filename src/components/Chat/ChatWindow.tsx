import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { Chat } from '../../types';
import { ChatInput } from './ChatInput';
import { ChatBubble } from './Message/ChatBubble';

interface ChatWindowProps {
  chat: Chat | null;
  onBack: () => void;
  onSendMessage: (message: string) => void;
  onStatusChange: (chat: Chat) => void;
  onToggleImportant?: (chat: Chat) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  onBack,
  onSendMessage,
  onStatusChange,
  onToggleImportant,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">選擇對話開始聊天</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 bg-white border-b">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full mr-3">
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center flex-1">
            <div className="flex items-center">
              <div className="relative">
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
              <div className="ml-3">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">{chat.name}</h2>
                  {chat.isImportant && (
                    <span className="text-xs text-yellow-500 font-medium">重要對話</span>
                  )}
                </div>
              </div>
            </div>

            {chat.labels && chat.labels.length > 0 && (
              <div className="flex items-center gap-2 ml-6">
                {chat.labels.map((label) => (
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
            )}

            <button
              onClick={() => onToggleImportant?.(chat)}
              className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                chat.isImportant 
                  ? 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100' 
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
              title={chat.isImportant ? '取消重要標記' : '標記為重要'}
            >
              <Star className={`w-5 h-5 ${chat.isImportant ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">
                {chat.isImportant ? '取消重要標記' : '標記為重要'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <div className="relative min-h-full pb-16">
          {chat.messages.map((message, index) => (
            <ChatBubble
              key={index}
              content={message.content}
              isUser={message.isUser}
              isHuman={message.isHuman}
              timestamp={message.timestamp}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput
        onSendMessage={onSendMessage}
        isAI={chat.isAI}
        onSwitchToAI={() => onStatusChange(chat)}
      />
    </div>
  );
};