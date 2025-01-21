import React, { useState } from "react";
import { COLOR_OPTIONS } from "../../constants/colors";

interface CreateLabelDialogProps {
  onConfirm: (name: string, color: string, wa_id: string) => void;
  onCancel: () => void;
}

export const CreateLabelDialog: React.FC<CreateLabelDialogProps> = ({ onConfirm, onCancel }) => {
  const [newLabelName, setNewLabelName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].value);

  const handleConfirm = () => {
    if (newLabelName.trim()) {
      // @ts-ignore
      onConfirm(newLabelName.trim(), selectedColor);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">新增標籤</h3>
        <input
          type="text"
          value={newLabelName}
          onChange={(e) => setNewLabelName(e.target.value)}
          placeholder="輸入標籤名稱"
          className="w-full p-2 border rounded-lg mb-4 text-sm"
        />
        <div className="grid grid-cols-4 gap-2 mb-4">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color.value}
              // @ts-ignore
              onClick={() => setSelectedColor(color.value)}
              className={`w-8 h-8 rounded-full ${color.value} ${
                selectedColor === color.value ? "ring-2 ring-offset-2 ring-blue-500" : ""
              }`}
              title={color.name}
            />
          ))}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
          >
            建立標籤
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};
