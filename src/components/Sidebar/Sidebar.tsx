import React, { useState } from 'react';
import { Chat, Label } from '../../types';
import { ChatSection } from './ChatSection';
import { SearchBar } from '../Search/SearchBar';
import { TabBar } from '../Navigation/TabBar';
import { LabelManager } from '../Labels/LabelManager';
import { initialLabels } from '../../data/initialData';

interface SidebarProps {
  aiChats: Chat[];
  humanChats: Chat[];
  onChatSelect: (chat: Chat) => void;
  onStatusChange: (chat: Chat) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  aiChats,
  humanChats,
  onChatSelect,
  onStatusChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLabelsExpanded, setIsLabelsExpanded] = useState(false);
  const [labels, setLabels] = useState<Label[]>(initialLabels);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);

  const counts = {
    all: humanChats.length + aiChats.length,
    human: humanChats.length,
    ai: aiChats.length,
    labels: labels.length,
  };

  const filterChatsByLabel = (chats: Chat[]) => {
    if (!selectedLabelId) return chats;
    return chats.filter(chat => 
      chat.labels?.some(label => label.id === selectedLabelId)
    );
  };

  const filterChatsBySearch = (chats: Chat[]) => {
    if (!searchQuery) return chats;
    return chats.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredHumanChats = filterChatsByLabel(filterChatsBySearch(humanChats));
  const filteredAiChats = filterChatsByLabel(filterChatsBySearch(aiChats));

  const handleCreateLabel = (name: string, color: string) => {
    const newLabel: Label = {
      id: (labels.length + 1).toString(),
      name,
      color,
      count: 0,
    };
    setLabels([...labels, newLabel]);
  };

  const handleDeleteLabel = (id: string) => {
    setLabels(labels.filter(label => label.id !== id));
    if (selectedLabelId === id) {
      setSelectedLabelId(null);
    }
  };

  const handleLabelClick = (labelId: string) => {
    setSelectedLabelId(labelId);
    setActiveTab('all'); // Reset to 'all' tab when selecting a label
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedLabelId(null); // Clear selected label when changing tabs
  };

  const renderChats = () => {
    switch (activeTab) {
      case 'human':
        return (
          <ChatSection
            title="人工客服"
            chats={filteredHumanChats}
            isAI={false}
            iconColor="text-green-700"
            bgColor="bg-green-50"
            onChatSelect={onChatSelect}
            onStatusChange={onStatusChange}
          />
        );
      case 'ai':
        return (
          <ChatSection
            title="AI對話"
            chats={filteredAiChats}
            isAI={true}
            iconColor="text-blue-700"
            bgColor="bg-blue-50"
            onChatSelect={onChatSelect}
            onStatusChange={onStatusChange}
          />
        );
      default:
        return (
          <>
            <ChatSection
              title="人工客服"
              chats={filteredHumanChats}
              isAI={false}
              iconColor="text-green-700"
              bgColor="bg-green-50"
              onChatSelect={onChatSelect}
              onStatusChange={onStatusChange}
            />
            <ChatSection
              title="AI對話"
              chats={filteredAiChats}
              isAI={true}
              iconColor="text-blue-700"
              bgColor="bg-blue-50"
              onChatSelect={onChatSelect}
              onStatusChange={onStatusChange}
            />
          </>
        );
    }
  };

  return (
    <div className="w-96 border-r h-screen bg-white flex flex-col">
      <div className="border-b">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <TabBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          counts={counts}
          isLabelsExpanded={isLabelsExpanded}
          onLabelsExpandToggle={() => setIsLabelsExpanded(!isLabelsExpanded)}
        />
      </div>
      <LabelManager
        labels={labels}
        onCreateLabel={handleCreateLabel}
        onDeleteLabel={handleDeleteLabel}
        onLabelClick={handleLabelClick}
        selectedLabelId={selectedLabelId}
        isExpanded={isLabelsExpanded}
        onToggleExpand={() => setIsLabelsExpanded(!isLabelsExpanded)}
      />
      <div className="flex-1 overflow-y-auto p-4">
        {renderChats()}
      </div>
    </div>
  );
};