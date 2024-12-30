import React from "react";
import { MessageTimeProps } from "./types";
import { formatMessageTime } from "../../../utils/dateFormat";
import { MESSAGE_STATUS } from "../../../constants/messages";

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
    <div className={`absolute bottom-[-24px] ${alignment} flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap`}>
      <span>{statusText}</span>
      <span>{formatMessageTime(new Date(timestamp))}</span>
      {/* <span>{timestamp.toString()}</span> */}
    </div>
  );
};
