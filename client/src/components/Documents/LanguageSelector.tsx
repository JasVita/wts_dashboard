import React from "react";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

interface LanguageSelectorProps {
  onSelect: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  return (
    <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg p-2 w-48">
      <input
        type="text"
        placeholder="Search language..."
        className="w-full p-2 mb-2 border rounded text-sm"
      />
      <div className="max-h-48 overflow-y-auto">
        {languages.map((language) => (
          <button
            key={language.code}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded flex items-center space-x-2"
            onClick={() => onSelect(language)}
          >
            <span>{language.flag}</span>
            <span className="text-sm">{language.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
