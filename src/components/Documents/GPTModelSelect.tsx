import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";

const GPT_MODELS = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "gpt-4-32k", name: "GPT-4 32K" },
];

export const GPTModelSelect: React.FC = () => {
  return (
    <Select>
      <SelectTrigger className="w-[180px] focus:ring-blue-500">
        <SelectValue placeholder="Select GPT model" />
      </SelectTrigger>
      <SelectContent>
        {GPT_MODELS.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
