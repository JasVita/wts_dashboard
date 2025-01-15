import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Star, Equal } from "lucide-react";
import { Chat, Label } from "../../types";
import { ChatInput } from "./ChatInput";
import { ChatBubble } from "./Message/ChatBubble";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import axios from "axios";
import { getLabels } from "@/data/initialData";

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
  const [labels, setLabels] = useState<Label[] | null>(chat?.labels || []);
  const [totalLabels, setTotalLabels] = useState<Label[] | null>(chat?.labels || []);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    chat?.labels?.map((label) => label.id) || []
  );
  const [originalLabels, setOriginalLabels] = useState<string[]>(
    chat?.labels?.map((label) => label.id) || []
  );

  // Fetch labels when the component mounts
  useEffect(() => {
    const fetchLabels = async () => {
      const labelsData = await getLabels();
      // console.log(labelsData[1].name);
      if (labelsData) {
        setTotalLabels(labelsData);
      }
    };
    fetchLabels();
  }, []);

  const handleOpenDialog = () => {
    setSelectedLabels(chat?.labels?.map((label) => label.id) || []); // Reset selected labels
    setOriginalLabels(chat?.labels?.map((label) => label.id) || []); // Reset original labels
  };

  const handleCheckboxChange = (labelId: string) => {
    setSelectedLabels(
      (prev) =>
        prev.includes(labelId)
          ? prev.filter((id) => id !== labelId) // Remove if unchecked
          : [...prev, labelId] // Add if checked
    );
  };

  const handleCancel = () => {
    setSelectedLabels(originalLabels); // Revert to the original labels
  };

  const handleSave = async () => {
    if (!chat) {
      console.error("Chat is null or undefined.");
      return;
    }

    const addedLabels = selectedLabels.filter((id) => !originalLabels.includes(id)); // Newly selected labels
    const removedLabels = originalLabels.filter((id) => !selectedLabels.includes(id)); // Newly deselected labels

    try {
      // Add wa_id to newly selected labels
      for (const labelId of addedLabels) {
        await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/assignLabel/${labelId}`, {
          wa_id: String(chat.wa_id), // Add the current chat's wa_id
        });
      }

      // Remove wa_id from newly deselected labels
      for (const labelId of removedLabels) {
        await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/removeLabel/${labelId}`, {
          wa_id: chat.wa_id, // Remove the current chat's wa_id
        });
      }
      console.log("Labels updated successfully!");

      // Refresh the page to fetch and display the latest state
      window.location.reload();
    } catch (error) {
      console.error("Failed to update labels:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  // Update labels when chat.labels changes
  useEffect(() => {
    if (chat?.labels) {
      setLabels(chat.labels);
    }
  }, [chat?.labels]);

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
          <button onClick={onBack} className="-100 rounded-full mr-3">
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center flex-1">
            <Dialog>
              <DialogTrigger>
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
                  {labels && chat.labels && chat.labels.length > 0 && (
                    <div className="flex items-center gap-2 ml-6">
                      {labels.slice(0, 2).map((label) => (
                        <div
                          key={label.id}
                          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${label.color.replace(
                            "bg-",
                            "bg-opacity-20 "
                          )} border border-opacity-20 ${label.color}`}
                        >
                          <span
                            className={`text-xs font-medium ${label.color.replace("bg-", "text-")}`}
                          >
                            {label.name}
                          </span>
                        </div>
                      ))}
                      {labels.length > 2 && (
                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium text-gray-500">
                          <span>...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </DialogTrigger>
              <DialogTitle></DialogTitle>
              <DialogContent className="flex flex-col gap-0">
                <img
                  src={chat.avatar}
                  className="w-1/4 h-full object-cover mx-auto mb-6 rounded-full"
                />
                <h3 className="mx-auto text-lg font-bold">{chat.name}</h3>
                <h3 className="mx-auto text-base font-medium">{chat.wa_id}</h3>
                <button
                  onClick={() => onToggleImportant?.(chat)}
                  className={`mx-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors mb-4 ${
                    chat.isImportant
                      ? "bg-yellow-50 text-yellow-500 hover:bg-yellow-100"
                      : "text-gray-400 hover:bg-gray-100"
                  }`}
                  title={chat.isImportant ? "取消重要標記" : "標記為重要"}
                >
                  <Star className={`w-5 h-5 ${chat.isImportant ? "fill-current" : ""}`} />
                  <span className="text-sm font-medium">
                    {chat.isImportant ? "取消重要標記" : "標記為重要"}
                  </span>
                </button>
                {labels && chat.labels && chat.labels.length > 0 && (
                  <div className="flex flex-col items-center">
                    {labels.map((label) => (
                      <div className="flex items-center gap-3 rounded-full transition-colors h-full mb-3 w-52 ml-2">
                        <div
                          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full w-full ${label.color.replace(
                            "bg-",
                            "bg-opacity-20 "
                          )} border border-opacity-20 ${label.color}`}
                        >
                          <span
                            className={`text-sm font-medium ${label.color.replace("bg-", "text-")}`}
                          >
                            {label.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 flex-col w-1/2 self-center">
                  <Dialog>
                    <DialogTrigger onClick={handleOpenDialog}>
                      <button className="flex items-center gap-2 rounded-lg hover:bg-gray-100 transition-colors h-6 ml-14">
                        <Equal className="w-4 h-4 text-gray-500 text-base"></Equal>
                        <span className="text-base font-normal text-gray-500 px-1.5">
                          assign label
                        </span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="w-96">
                      <div className="flex flex-col items-center p-4">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Assign Labels</h3>

                        {/* Scrollable Section */}
                        <div className="flex flex-col gap-3 w-2/3 max-h-48 overflow-y-auto pr-1">
                          {totalLabels?.map((label) => (
                            <div
                              key={label.id}
                              className="flex items-center gap-3 rounded-full transition-colors h-full w-full"
                            >
                              <input
                                type="checkbox"
                                value={label.id}
                                checked={selectedLabels.includes(String(label.id))} // Pre-check based on state
                                onChange={(e) => handleCheckboxChange(e.target.value)}
                                className="checked:bg-gray-400 h-5 w-5"
                              />
                              <div
                                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full w-full ${label.color.replace(
                                  "bg-",
                                  "bg-opacity-20 "
                                )} border border-opacity-20 ${label.color}`}
                              >
                                <span
                                  className={`text-sm font-medium ${label.color.replace(
                                    "bg-",
                                    "text-"
                                  )}`}
                                >
                                  {label.name}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end gap-2 mt-6 self-end">
                          <DialogClose>
                            <button
                              onClick={handleCancel}
                              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                            >
                              Cancel
                            </button>
                          </DialogClose>
                          <DialogClose>
                            <button
                              onClick={handleSave}
                              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                            >
                              Save
                            </button>
                          </DialogClose>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </DialogContent>
            </Dialog>

            <button
              onClick={() => onToggleImportant?.(chat)}
              className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                chat.isImportant
                  ? "bg-yellow-50 text-yellow-500 hover:bg-yellow-100"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
              title={chat.isImportant ? "取消重要標記" : "標記為重要"}
            >
              <Star className={`w-5 h-5 ${chat.isImportant ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">
                {chat.isImportant ? "取消重要標記" : "標記為重要"}
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
              inputType={message.input_type || "text"}
              inputImgId={message.input_imgid}
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
