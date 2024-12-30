import React from 'react';
import { Camera, Image, FileText, User, BarChart2, Pencil } from 'lucide-react';

interface AttachmentMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AttachmentOption {
  icon: React.ReactNode;
  label: string;
  color: string;
}

const attachmentOptions: AttachmentOption[] = [
  { icon: <Image className="w-5 h-5" />, label: 'Photos & videos', color: 'bg-violet-500' },
  { icon: <Camera className="w-5 h-5" />, label: 'Camera', color: 'bg-red-500' },
  { icon: <FileText className="w-5 h-5" />, label: 'Document', color: 'bg-blue-500' },
  { icon: <User className="w-5 h-5" />, label: 'Contact', color: 'bg-cyan-500' },
  { icon: <BarChart2 className="w-5 h-5" />, label: 'Poll', color: 'bg-green-500' },
  { icon: <Pencil className="w-5 h-5" />, label: 'Drawing', color: 'bg-yellow-500' },
];

export const AttachmentMenu: React.FC<AttachmentMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg p-2 grid grid-cols-3 gap-2 w-72"
      onClick={(e) => e.stopPropagation()}
    >
      {attachmentOptions.map((option, index) => (
        <button
          key={index}
          className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => {
            // Handle attachment option click
            onClose();
          }}
        >
          <div className={`w-12 h-12 ${option.color} rounded-full flex items-center justify-center text-white mb-2`}>
            {option.icon}
          </div>
          <span className="text-xs text-gray-600 text-center">{option.label}</span>
        </button>
      ))}
    </div>
  );
};