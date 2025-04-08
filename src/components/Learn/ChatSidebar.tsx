// import React from "react";
// import { FiPlus, FiMessageSquare, FiX } from "react-icons/fi";

// interface ChatSidebarProps {
//   isVisible: boolean;
//   onClose: () => void;
// }

// const ChatSidebar: React.FC<ChatSidebarProps> = ({ isVisible, onClose }) => {
//   // Using initialChats for chat history
//   const initialChats = [
//     { id: "chat1", title: "What is AI", timestamp: new Date() },
//   ];

//   return (
//     <aside
//       className={`bg-white border-r border-gray-200 transition-all duration-300 z-20
//         md:relative absolute md:h-auto h-full
//         ${isVisible ? "w-64 left-0" : "w-0 -left-64 md:left-0 overflow-hidden"}
//       `}
//     >
//       {/* Close button - visible only on mobile */}
//       <button
//         onClick={onClose}
//         className="md:hidden absolute top-3 right-3 text-gray-500 hover:text-black"
//         aria-label="Close sidebar"
//       >
//         <FiX size={20} />
//       </button>

//       {/* Header */}
//       <div className="py-3 px-4 border-b border-gray-200">
//         <h2 className="text-lg font-medium">Chats</h2>
//       </div>

//       {/* Content */}
//       <div className="p-4">
//         {/* New Chat Button */}
//         <button className="flex items-center w-full bg-white border border-gray-200 rounded-md mb-4 py-2 px-3 text-sm hover:bg-gray-50">
//           <FiPlus className="mr-2" size={16} /> New Chat
//         </button>

//         {/* Chat List */}
//         <div className="space-y-2">
//           {initialChats.map((chat) => (
//             <div
//               key={chat.id}
//               className="p-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
//             >
//               <div className="flex items-center">
//                 <FiMessageSquare className="text-gray-500 mr-2" size={14} />
//                 <span className="text-sm">{chat.title}</span>
//               </div>
//               <div className="text-xs text-gray-500 mt-1">
//                 {chat.timestamp.toLocaleDateString()}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Empty state when no chats exist */}
//         {initialChats.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-8 text-gray-500">
//             <FiMessageSquare size={24} className="mb-2" />
//             <p className="text-sm text-center">No chats yet</p>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// };

// export default ChatSidebar;

import React, { useState, useEffect } from "react";
import { FiPlus, FiMessageSquare, FiX, FiLoader } from "react-icons/fi";
import axios from "axios";
import { useAppContext } from "../../Providers/AppContext";
import { access_token, backendURL } from "../../utils/constants";

interface ChatSidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectChatroom: (chatroomId: string) => void;
  currentChatroomId: string | null;
}

interface Chatroom {
  id: string;
  title: string;
  created_at: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isVisible,
  onClose,
  onSelectChatroom,
  currentChatroomId,
}) => {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAppContext();
  const token = access_token();

  const fetchChatrooms = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await axios.get(`${backendURL}/api/chat/chatroom/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChatrooms(response.data);
    } catch (error) {
      console.error("Failed to fetch chatrooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatrooms();
  }, [user]);

  const createNewChat = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}/api/chat/chatroom/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new chatroom to the list
      setChatrooms((prev) => [response.data, ...prev]);

      // Select the newly created chatroom
      onSelectChatroom(response.data.id);
    } catch (error) {
      console.error("Failed to create new chatroom:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <button
          className="flex items-center justify-center w-full bg-white border border-gray-200 rounded-md mb-4 py-2 px-3 text-sm hover:bg-gray-50"
          onClick={createNewChat}
          disabled={loading}
        >
          {loading ? (
            <FiLoader className="animate-spin mr-2" size={16} />
          ) : (
            <FiPlus className="mr-2" size={16} />
          )}
          New Chat
        </button>

        {/* Chat List */}
        <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {loading && chatrooms.length === 0 ? (
            <div className="flex justify-center py-4">
              <FiLoader className="animate-spin text-gray-400" size={24} />
            </div>
          ) : (
            chatrooms.map((chat) => (
              <div
                key={chat.id}
                className={`p-3 rounded-md cursor-pointer ${
                  currentChatroomId === chat.id
                    ? "bg-gray-200"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => onSelectChatroom(chat.id)}
              >
                <div className="flex items-center">
                  <FiMessageSquare className="text-gray-500 mr-2" size={14} />
                  <span className="text-sm truncate">
                    {chat.title || `Chat ${String(chat.id).substring(0, 8)}`}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(chat.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty state when no chats exist */}
        {!loading && chatrooms.length === 0 && (
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
