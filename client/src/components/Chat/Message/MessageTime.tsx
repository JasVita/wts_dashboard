import React from "react";

export type MessageType = "user" | "ai" | "human";

interface MessageTimeProps {
  type: MessageType;
  timestamp: Date;
}

const formatMessageTime = (date: Date | null | undefined): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error("Invalid date object passed to formatMessageTime:", date);
    return "N/A"; // Or another appropriate fallback value
  }
  try {
    return new Intl.DateTimeFormat("zh-HK", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error, date);
    return "N/A"; // Or another appropriate fallback value
  }
};

const MESSAGE_STATUS = {
  AI: "AI 回覆",
  HUMAN: "人工回覆",
  USER: "客戶回覆",
};

export const MessageTime: React.FC<MessageTimeProps> = ({ type, timestamp }) => {
  const getStatusText = () => {
    switch (type) {
      case "user":
        return MESSAGE_STATUS.USER;
      case "ai":
        return MESSAGE_STATUS.AI;
      case "human":
        return MESSAGE_STATUS.HUMAN;
    }
  };

  const statusText = getStatusText();
  const alignment = type === "user" ? "left-0" : "right-0";

  return (
    <div
      className={`absolute bottom-[-24px] ${alignment} flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap`}
    >
      <span>{statusText}</span>
      <span>{formatMessageTime(new Date(timestamp))}</span>
      {/* <span>{timestamp.toString()}</span> */}
    </div>
  );
};
