import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Label } from "../../types";
import { INTERFACE_TEXT } from "../../constants/labels";

interface LabelManagerProps {
  labels: Label[];
  onLabelClick?: (id: string) => void;
  selectedLabelId?: string | null;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const LabelManager: React.FC<LabelManagerProps> = ({
  labels,
  onLabelClick,
  selectedLabelId,
  isExpanded,
  onToggleExpand,
}) => {
  return (
    <div className="border-b">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onToggleExpand}>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="font-medium">{INTERFACE_TEXT.SECTIONS.LABELS}</span>
        </div>
      </div>

      {isExpanded && (
        <>
          {labels.map((label) => (
            <div
              key={label.id}
              className={`flex items-center px-4 py-2 hover:bg-gray-50 group cursor-pointer ${
                selectedLabelId === label.id ? "bg-gray-100" : ""
              }`}
              onClick={() => onLabelClick?.(label.id)}
            >
              <div
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${label.color.replace(
                  "bg-",
                  "bg-opacity-20 "
                )} border border-opacity-20 ${label.color}`}
              >
                <span className={`text-xs font-medium ${label.color.replace("bg-", "text-")}`}>
                  {label.name}
                </span>
              </div>
              <span className="text-xs text-gray-500 ml-2">{label.count}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
