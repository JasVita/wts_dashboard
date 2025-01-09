import React, { useEffect, useState } from "react";
import { Chat, Label } from "../../types";
import { ChatSection } from "./ChatSection";
import { SearchBar } from "../Search/SearchBar";
import { TabBar } from "../Navigation/TabBar";
import { LabelManager } from "../Labels/LabelManager";

import { getLabels } from "../../data/initialData";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLabelsExpanded, setIsLabelsExpanded] = useState(false);
  const [labels, setLabels] = useState<Label[]>();
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);

  // Fetch labels when the component mounts
  useEffect(() => {
    const fetchLabels = async () => {
      const labelsData = await getLabels();
      if (labelsData) {
        setLabels(labelsData);
      }
    };
    fetchLabels();
  }, []);

  const counts = {
    all: humanChats.length + aiChats.length,
    human: humanChats.length,
    ai: aiChats.length,
    labels: labels?.length,
  };

  const filterChatsByLabel = (chats: Chat[]) => {
    // console.log("labels: ", labels);
    // console.log("selected label: ", selectedLabelId);
    if (!selectedLabelId) return chats;
    return chats.filter((chat) =>
      chat.labels?.some((label) => parseInt(label.id) === parseInt(selectedLabelId))
    );
  };

  const filterChatsBySearch = (chats: Chat[]) => {
    if (!searchQuery) return chats;
    return chats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredHumanChats = filterChatsByLabel(filterChatsBySearch(humanChats));
  const filteredAiChats = filterChatsByLabel(filterChatsBySearch(aiChats));
  // console.log("filtered human: ", filteredHumanChats);
  const handleLabelClick = (labelId: string) => {
    setSelectedLabelId(labelId);
    setActiveTab("all"); // Reset to 'all' tab when selecting a label
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedLabelId(null); // Clear selected label when changing tabs
  };

  const renderChats = () => {
    switch (activeTab) {
      case "human":
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
      case "ai":
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
        labels={labels || []}
        onLabelClick={handleLabelClick}
        selectedLabelId={selectedLabelId}
        isExpanded={isLabelsExpanded}
        onToggleExpand={() => setIsLabelsExpanded(!isLabelsExpanded)}
      />
      <div className="flex-1 overflow-y-auto p-4">{renderChats()}</div>
    </div>
  );
};
