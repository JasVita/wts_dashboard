import React from 'react';
import { MessageSquare, Bot, Users, Tag } from 'lucide-react';
import { ChatType } from '../../types';

interface NavigationProps {
  activeTab: ChatType;
  onTabChange: (tab: ChatType) => void;
  aiCount: number;
  humanCount: number;
  labelCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  aiCount,
  humanCount,
  labelCount,
}) => {
  const tabs = [
    { id: 'all' as ChatType, icon: MessageSquare, label: 'All Chats', count: aiCount + humanCount },
    { id: 'human' as ChatType, icon: Users, label: 'Human Chats', count: humanCount },
    { id: 'ai' as ChatType, icon: Bot, label: 'AI Chats', count: aiCount },
    { id: 'labels' as ChatType, icon: Tag, label: 'Labels', count: labelCount },
  ];

  return (
    <div className="flex items-center space-x-2 p-4 bg-white border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === tab.id
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <tab.icon className="w-5 h-5" />
          <span>{tab.label}</span>
          <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};