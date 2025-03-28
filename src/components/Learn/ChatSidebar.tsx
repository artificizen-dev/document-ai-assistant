import React from "react";
import { FiPlus, FiMessageSquare, FiX } from "react-icons/fi";

interface ChatSidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isVisible, onClose }) => {
  // Using initialChats for chat history
  const initialChats = [
    { id: "chat1", title: "What is AI", timestamp: new Date() },
  ];

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 z-20
        md:relative absolute md:h-auto h-full
        ${isVisible ? "w-64 left-0" : "w-0 -left-64 md:left-0 overflow-hidden"}
      `}
    >
      {/* Close button - visible only on mobile */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-3 right-3 text-gray-500 hover:text-black"
        aria-label="Close sidebar"
      >
        <FiX size={20} />
      </button>

      {/* Header */}
      <div className="py-3 px-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">Chats</h2>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* New Chat Button */}
        <button className="flex items-center w-full bg-white border border-gray-200 rounded-md mb-4 py-2 px-3 text-sm hover:bg-gray-50">
          <FiPlus className="mr-2" size={16} /> New Chat
        </button>

        {/* Chat List */}
        <div className="space-y-2">
          {initialChats.map((chat) => (
            <div
              key={chat.id}
              className="p-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
            >
              <div className="flex items-center">
                <FiMessageSquare className="text-gray-500 mr-2" size={14} />
                <span className="text-sm">{chat.title}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {chat.timestamp.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state when no chats exist */}
        {initialChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <FiMessageSquare size={24} className="mb-2" />
            <p className="text-sm text-center">No chats yet</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
