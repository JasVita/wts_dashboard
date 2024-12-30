import React from 'react';
import { MessageSquare, BarChart2 } from 'lucide-react';

interface NarrowSidebarProps {
  activeView: 'messages' | 'analytics';
  onViewChange: (view: 'messages' | 'analytics') => void;
}

export const NarrowSidebar: React.FC<NarrowSidebarProps> = ({
  activeView,
  onViewChange,
}) => {
  return (
    <div className="w-14 border-r bg-white flex flex-col items-center py-4">
      <button
        onClick={() => onViewChange('messages')}
        className={`p-3 rounded-lg mb-2 transition-colors ${
          activeView === 'messages'
            ? 'bg-green-50 text-green-600'
            : 'text-gray-400 hover:bg-gray-50'
        }`}
        title="訊息"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewChange('analytics')}
        className={`p-3 rounded-lg transition-colors ${
          activeView === 'analytics'
            ? 'bg-green-50 text-green-600'
            : 'text-gray-400 hover:bg-gray-50'
        }`}
        title="數據分析"
      >
        <BarChart2 className="w-5 h-5" />
      </button>
    </div>
  );
};