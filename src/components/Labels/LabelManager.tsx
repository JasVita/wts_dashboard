import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import { Label } from "../../types";
import { INTERFACE_TEXT } from "../../constants/labels";
import axios from "axios";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { CreateLabelDialog } from "./CreateLabelDialog";

interface LabelManagerProps {
  passedlabels: Label[];
  onLabelClick?: (id: string) => void;
  passedselectedLabelId: string | null;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const LabelManager: React.FC<LabelManagerProps> = ({
  passedlabels,
  onLabelClick,
  passedselectedLabelId,
  isExpanded,
  onToggleExpand,
}) => {
  const [labels, setLabels] = useState<Label[] | null>(passedlabels || []);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    setLabels(passedlabels);
    setSelectedLabelId(passedselectedLabelId);
  }, [passedlabels]);

  const handleDeleteLabel = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/deleteLabel/${id}`);

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

  const handleCreateLabel = async (name: string, color: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/addLabel/customers`, {
        name: name,
        color: color,
      });

      const newLabel: Label = response.data;

      if (labels) {
        setLabels([...labels, newLabel]);
      } else {
        setLabels([newLabel]);
      }
      window.location.reload();
    } catch (error) {
      console.error("Failed to create a new label:", error);
    }
  };

  return (
    <div className="border-b">
      <div className="p-3 flex items-center relative">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onToggleExpand}>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="font-medium">{INTERFACE_TEXT.SECTIONS.LABELS}</span>
          {isExpanded && (
            <button
              onClick={() => {
                setShowCreateDialog(true);
              }}
              className="flex items-center gap-2 rounded-lg hover:bg-gray-100 transition-colors h-6 absolute right-4"
            >
              <Plus className="w-4 h-4 text-base" />
              <span className="text-base font-normal px-1.5">add label</span>
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="relative">
          {labels?.map((label) => (
            <div
              key={label.id}
              className={`flex items-center px-4 py-2 hover:bg-gray-50 group cursor-pointer relative ${
                selectedLabelId === label.id ? "bg-gray-100" : ""
              }`}
              onClick={() => onLabelClick?.(label.id)}
            >
              <div
                className={`flex items-center justify-center gap-0.5 px-1.5 py-0.5 rounded-full ${label.color.replace(
                  "bg-",
                  "bg-opacity-20 "
                )} border border-opacity-20 ${label.color}`}
              >
                <span className={`text-xs font-medium ${label.color.replace("bg-", "text-")}`}>
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
              <span className="text-xs text-gray-500 ml-2">{label.count}</span>
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
          ))}
        </div>
      )}
      {showCreateDialog && (
        <CreateLabelDialog
          onConfirm={(name: string, color: string) => {
            handleCreateLabel(name, color)
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
    </div>
  );
};
