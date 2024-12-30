import React from 'react';
import { MessageSquare, Bot, Users, Tag, ChevronDown, ChevronRight } from 'lucide-react';
import { INTERFACE_TEXT } from '../../constants/labels';

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    all: number;
    human: number;
    ai: number;
    labels: number;
  };
  isLabelsExpanded: boolean;
  onLabelsExpandToggle: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  counts,
  isLabelsExpanded,
  onLabelsExpandToggle,
}) => {
  const tabs = [
    { id: 'all', icon: MessageSquare, label: '全部', count: counts.all },
    { id: 'human', icon: Users, label: '人工客服', count: counts.human },
    { id: 'ai', icon: Bot, label: INTERFACE_TEXT.SECTIONS.AI_CHAT, count: counts.ai },
  ];

  return (
    <div className="px-2 pb-2">
      <div className="flex items-center gap-x-1 w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5 mr-1" />
            <span className="whitespace-nowrap">{tab.label}</span>
            <span className="ml-1 px-1.5 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
        <button
          onClick={onLabelsExpandToggle}
          className={`flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${
            activeTab === 'labels'
              ? 'bg-green-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Tag className="w-3.5 h-3.5 mr-1" />
          <span className="whitespace-nowrap">{INTERFACE_TEXT.SECTIONS.LABELS}</span>
          {isLabelsExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 ml-1" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          )}
        </button>
      </div>
    </div>
  );
};