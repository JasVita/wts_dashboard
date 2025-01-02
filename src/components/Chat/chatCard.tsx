import React from "react";
import { Chat } from "../../types";

interface ChatCardProps {
  chat: Chat;
  onClose: () => void;
}

const ChatCard: React.FC<ChatCardProps> = ({ chat, onClose }) => {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <img src={chat.avatar} alt="Avatar" className="w-12 h-12 rounded-full" />
          <div>
            <p className="font-bold text-lg">{chat.name}</p>
            <p className="text-gray-500">{123123123}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            Close
          </button>
        </div>
        <div>
          <button>Show Media Links and Docs</button>
          <button>Show Labels</button>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
