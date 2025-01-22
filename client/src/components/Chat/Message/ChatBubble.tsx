import React from "react";
import { Label } from "../../../types";
import { MessageBubble } from "./MessageBubble";

type MessageType = "user" | "ai" | "human";

interface ChatBubbleProps {
  content: string;
  isUser: boolean;
  isHuman?: boolean;
  timestamp: Date;
  labels?: Label[];
  inputType: string;
  inputImgId?: string;
}

const getMessageAlignment = (type: MessageType) => {
  return type === "user" ? "left" : "right";
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  content,
  isUser,
  isHuman,
  timestamp,
  labels,
  inputType,
  inputImgId,
}) => {
  const getMessageType = (): MessageType => {
    if (isUser) return "user";
    return isHuman ? "human" : "ai";
  };

  const type = getMessageType();
  const alignment = getMessageAlignment(type);

  return (
    <div className={`flex ${alignment === "left" ? "justify-start" : "justify-end"} mb-8`}>
      <div className="flex flex-col max-w-[70%]">
        <MessageBubble
          content={content}
          type={type}
          timestamp={timestamp}
          inputType={inputType}
          inputImgId={inputImgId}
        />

        {labels && labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {labels.map((label) => (
              <span
                key={label.id}
                className={`px-2 py-0.5 rounded-full text-xs text-white ${label.color}`}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
