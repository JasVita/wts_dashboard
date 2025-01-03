import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Plus, Star, X } from "lucide-react";
import { Chat, Label } from "../../types";
import { ChatInput } from "./ChatInput";
import { ChatBubble } from "./Message/ChatBubble";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateLabelDialog } from "../Labels/CreateLabelDialog";
import { DeleteConfirmDialog } from "../Labels/DeleteConfirmDialog";
import axios from "axios";

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
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreateLabel = async (name: string, color: string, wa_id: string) => {
    try {
      const response = await axios.post("http://localhost:3000/api/addLabel/customers", {
        name: name,
        color: color,
        customerId: wa_id, // Replace 123 with the actual customer ID
      });

      const newLabel: Label = response.data;

      if (labels) {
        setLabels([...labels, newLabel]);
      } else {
        setLabels([newLabel]);
      }
    } catch (error) {
      console.error("Failed to create a new label:", error);
    }
  };

  const handleDeleteLabel = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/deleteLabel/${id}`);

      if (labels) {
        setLabels(labels.filter((label) => label.id !== id));
        if (selectedLabelId === id) {
          setSelectedLabelId(null);
        }
      }
    } catch (error) {
      console.error(`Failed to delete label with ID ${id}:`, error);
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
                      {labels.map((label) => (
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
                          <button
                            id={label.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(label.id);
                            }}
                            className="p-1 rounded-lg opacity-100 group-hover:opacity-100 transition-opacity ml-auto"
                          >
                            <X className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 flex-col w-1/2 self-center">
                  <button
                    onClick={() => setShowCreateDialog(true)}
                    className="flex items-center gap-2 rounded-lg hover:bg-gray-100 transition-colors h-6 ml-14 w-1/2"
                  >
                    <Plus className="w-4 h-4 ml-3 text-gray-500 text-base" />
                    <span className="text-base font-normal text-gray-500 px-1.5">add label</span>
                  </button>
                  {showCreateDialog && (
                    <CreateLabelDialog
                      onConfirm={(name: string, color: string) => {
                        handleCreateLabel(name, color, chat.wa_id)
                          .then(() => {
                            setShowCreateDialog(false);
                          })
                          .catch((error) => {
                            // Handle error
                            console.error("Error creating label:", error);
                          });
                      }}
                      onCancel={() => setShowCreateDialog(false)}
                    />
                  )}

                  {deleteConfirmId && (
                    <DeleteConfirmDialog
                      onConfirm={() => {
                        handleDeleteLabel(deleteConfirmId);
                        setDeleteConfirmId(null);
                      }}
                      onCancel={() => setDeleteConfirmId(null)}
                    />
                  )}
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
