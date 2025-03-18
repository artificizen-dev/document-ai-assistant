import React from "react";
import { FiUser, FiBookOpen } from "react-icons/fi";

export type MessageType = "user" | "bot";

interface ChatMessageProps {
  type: MessageType;
  content: string;
  timestamp?: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  content,
  timestamp,
}) => {
  const isUser = type === "user";
  console.log(timestamp);

  return (
    <div className={`flex mb-4 ${isUser ? "" : "bg-gray-50 py-4"}`}>
      <div className="flex-shrink-0 mr-3 ml-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-gray-200" : "bg-black text-white"
          }`}
        >
          {isUser ? <FiUser size={16} /> : <FiBookOpen size={16} />}
        </div>
      </div>

      <div className="flex-1 mr-4">
        <div className="font-medium mb-1">
          {isUser ? "You" : "AI Assistant"}
        </div>
        <div className="text-gray-800">{content}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
