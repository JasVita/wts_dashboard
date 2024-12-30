import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, X } from 'lucide-react';
import { Label } from '../../types';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { CreateLabelDialog } from './CreateLabelDialog';
import { INTERFACE_TEXT } from '../../constants/labels';

interface LabelManagerProps {
  labels: Label[];
  onCreateLabel: (name: string, color: string) => void;
  onDeleteLabel?: (id: string) => void;
  onLabelClick?: (id: string) => void;
  selectedLabelId?: string | null;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const LabelManager: React.FC<LabelManagerProps> = ({
  labels,
  onCreateLabel,
  onDeleteLabel,
  onLabelClick,
  selectedLabelId,
  isExpanded,
  onToggleExpand,
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  return (
    <div className="border-b">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onToggleExpand}>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <span className="font-medium">{INTERFACE_TEXT.SECTIONS.LABELS}</span>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <>
          {labels.map((label) => (
            <div
              key={label.id}
              className={`flex items-center px-4 py-2 hover:bg-gray-50 group cursor-pointer ${
                selectedLabelId === label.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => onLabelClick?.(label.id)}
            >
              <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${label.color.replace('bg-', 'bg-opacity-20 ')} border border-opacity-20 ${label.color}`}>
                <span className={`text-xs font-medium ${label.color.replace('bg-', 'text-')}`}>
                  {label.name}
                </span>
              </div>
              <span className="text-xs text-gray-500 ml-2">{label.count}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteConfirmId(label.id);
                }}
                className="p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
              >
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
          ))}

          {showCreateDialog && (
            <CreateLabelDialog
              onConfirm={(name, color) => {
                onCreateLabel(name, color);
                setShowCreateDialog(false);
              }}
              onCancel={() => setShowCreateDialog(false)}
            />
          )}

          {deleteConfirmId && (
            <DeleteConfirmDialog
              onConfirm={() => {
                onDeleteLabel?.(deleteConfirmId);
                setDeleteConfirmId(null);
              }}
              onCancel={() => setDeleteConfirmId(null)}
            />
          )}
        </>
      )}
    </div>
  );
};