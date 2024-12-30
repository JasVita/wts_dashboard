import React, { useState } from 'react';
import { Smile, Paperclip, Send } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { AttachmentMenu } from './AttachmentMenu';
import { INTERFACE_TEXT } from '../../constants/labels';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isAI: boolean;
  onSwitchToAI: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isAI, onSwitchToAI }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  if (isAI) {
    return (
      <div className="p-4 bg-gray-50">
        <button
          onClick={onSwitchToAI}
          className="w-full py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          {INTERFACE_TEXT.ACTIONS.TO_HUMAN}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t relative">
      <div className="flex items-center space-x-3">
        <button
          type="button"
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile className="w-6 h-6 text-gray-500" />
        </button>
        <button
          type="button"
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={() => setShowAttachments(!showAttachments)}
        >
          <Paperclip className="w-6 h-6 text-gray-500" />
        </button>
        <button
          type="button"
          onClick={onSwitchToAI}
          className="px-6 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center whitespace-nowrap text-sm font-medium tracking-wide"
        >
          {INTERFACE_TEXT.ACTIONS.TO_AI}
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="輸入訊息..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>

      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-2">
          <Picker data={data} onEmojiSelect={(emoji: any) => setMessage(prev => prev + emoji.native)} />
        </div>
      )}

      <AttachmentMenu
        isOpen={showAttachments}
        onClose={() => setShowAttachments(false)}
      />
    </form>
  );
};