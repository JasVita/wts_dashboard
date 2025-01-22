import React from "react";
import { Search } from "lucide-react";
import { INTERFACE_TEXT } from "../constants/labels";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="px-2 py-2">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={INTERFACE_TEXT.ACTIONS.SEARCH}
          className="w-full pl-8 pr-3 py-1.5 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 text-sm"
        />
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
};
