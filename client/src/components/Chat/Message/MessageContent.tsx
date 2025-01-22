import React from "react";

type MessageType = "user" | "ai" | "human";

interface MessageContentProps {
  content: string;
  type: MessageType;
}

const getMessageStyles = (type: MessageType) => {
  const styles = {
    user: "bg-white text-gray-800",
    ai: "bg-blue-500 text-white",
    human: "bg-green-500 text-white",
  };

  return styles[type];
};

export const MessageContent: React.FC<MessageContentProps> = ({ content, type }) => {
  return <div className={`p-3 rounded-lg ${getMessageStyles(type)}`}>{content}</div>;
};
