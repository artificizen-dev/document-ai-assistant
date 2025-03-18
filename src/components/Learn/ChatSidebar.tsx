import React, { useState } from "react";
import { FiPlus, FiMessageSquare, FiHeadphones, FiX } from "react-icons/fi";

interface ChatSidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState("chats");
  // Using initialChats to avoid the setChats warning
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

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === "chats"
              ? "bg-white text-black border-b-2 border-black"
              : "bg-gray-100 text-gray-600"
          }`}
          onClick={() => setActiveTab("chats")}
        >
          Chats
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === "podcasts"
              ? "bg-white text-black border-b-2 border-black"
              : "bg-gray-100 text-gray-600"
          }`}
          onClick={() => setActiveTab("podcasts")}
        >
          Podcasts
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* New Chat Button */}
        <button className="flex items-center w-full bg-white border border-gray-200 rounded-md mb-4 py-2 px-3 text-sm hover:bg-gray-50">
          <FiPlus className="mr-2" size={16} /> New Chat
        </button>

        {/* Chat List */}
        {activeTab === "chats" && (
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
              </div>
            ))}
          </div>
        )}

        {/* Podcasts List (empty for now) */}
        {activeTab === "podcasts" && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <FiHeadphones size={24} className="mb-2" />
            <p className="text-sm text-center">No podcasts yet</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
