import React from "react";
import { MessageContent } from "./MessageContent";
import { MessageTime } from "./MessageTime";
import { MessageType } from "./types";

interface MessageBubbleProps {
  content: string;
  type: MessageType;
  timestamp: Date;
  inputType: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  type,
  timestamp,
  inputType,
}) => {
  const isAudio = inputType === "audio";
  let isImage = inputType == "image" && content.startsWith("https:");
  return (
    <div className="relative mb-10">
      {isImage ? (
        <img src={content} className="max-w-full max-h-64 rounded-lg shadow-md" />
      ) : (
        <MessageContent content={content} type={type} />
      )}
      {isAudio && <div>audio message</div>}
      <MessageTime type={type} timestamp={timestamp} />
    </div>
  );
};
