import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiMessageSquare,
  FiX,
  FiLoader,
  FiArrowLeft,
  FiTrash2,
} from "react-icons/fi";
import { useAppContext } from "../../Providers/AppContext";
import ROUTES from "../../routes";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendURL, access_token } from "../../utils/constants";
import DeleteChatroomModal from "./DeleteChatroomModal";

interface ChatSidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isVisible, onClose }) => {
  const {
    chatrooms,
    currentChatroomId,
    isLoadingChatrooms,
    selectChatroom,
    createChatroom,
    user,
    fetchChatrooms,
  } = useAppContext();

  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const handleCreateNewChat = async () => {
    await createChatroom();
  };

  useEffect(() => {
    if (user) {
      fetchChatrooms();
    }
  }, [user]);

  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setDeletingChatId(chatId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingChatId) return;

    setIsDeleting(true);
    try {
      const token = access_token();
      await axios.delete(`${backendURL}/api/chat/delete-conversation/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { chatroom_id: deletingChatId },
      });

      // If the deleted chatroom is the current one, create a new one or select another
      if (currentChatroomId === deletingChatId) {
        if (chatrooms.length > 1) {
          // Find another chatroom to select
          const nextChatroom = chatrooms.find(
            (chat) => chat.id !== deletingChatId
          );
          if (nextChatroom) {
            selectChatroom(nextChatroom.id);
          }
        } else {
          // Create a new chatroom if this was the last one
          await createChatroom();
        }
      }

      // Refresh the chatrooms list
      fetchChatrooms();

      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete chatroom:", error);
    } finally {
      setIsDeleting(false);
      setDeletingChatId(null);
    }
  };

  // Find the title of the chat being deleted
  const getChatTitle = (chatId: string | null) => {
    if (!chatId) return "";
    const chat = chatrooms.find((c) => c.id === chatId);
    return chat ? chat.title || `Chat ${String(chat.id).substring(0, 8)}` : "";
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 z-20
        md:relative absolute md:h-auto h-full mt-2
        ${isVisible ? "w-64 left-0" : "w-0 -left-64 md:left-0 overflow-hidden"}
      `}
    >
      <button
        onClick={onClose}
        className="md:hidden absolute top-3 right-3 text-gray-500 hover:text-black"
        aria-label="Close sidebar"
      >
        <FiX size={20} />
      </button>

      <div className="py-3 px-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">Chats</h2>
      </div>

      <div className="p-4">
        <button
          className="flex items-center justify-center w-full bg-white border border-gray-200 rounded-md mb-4 py-2 px-3 text-sm hover:bg-gray-50"
          onClick={handleCreateNewChat}
          disabled={isLoadingChatrooms}
        >
          {isLoadingChatrooms ? (
            <FiLoader className="animate-spin mr-2" size={16} />
          ) : (
            <FiPlus className="mr-2" size={16} />
          )}
          New Chat
        </button>

        <div className="space-y-2 max-h-[calc(100vh-205px)] overflow-y-auto">
          {isLoadingChatrooms && chatrooms.length === 0 ? (
            <div className="flex justify-center py-4">
              <FiLoader className="animate-spin text-gray-400" size={24} />
            </div>
          ) : (
            chatrooms.map((chat) => (
              <div
                key={chat.id}
                className={`p-3 rounded-md cursor-pointer relative group ${
                  currentChatroomId === chat.id
                    ? "bg-gray-300"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => selectChatroom(chat.id)}
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center overflow-hidden">
                    <FiMessageSquare
                      className="text-gray-500 mr-2 flex-shrink-0"
                      size={14}
                    />
                    <span className="text-sm truncate">
                      {chat.title || `Chat ${String(chat.id).substring(0, 8)}`}
                    </span>
                  </div>

                  {/* Delete button appears on hover */}
                  <button
                    className={`text-gray-500 hover:text-red-500 p-1 rounded transition-opacity ${
                      hoveredChatId === chat.id ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={(e) => handleDeleteClick(e, chat.id)}
                    aria-label="Delete chat"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(chat.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty state when no chats exist */}
        {!isLoadingChatrooms && chatrooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <FiMessageSquare size={24} className="mb-2" />
            <p className="text-sm text-center">No chats yet</p>
          </div>
        )}
        <div className="absolute md:bottom-2 bottom-15 left-1">
          <button
            onClick={() => navigate(ROUTES.default)}
            className="flex items-center text-gray-600 hover:text-black pt-2"
          >
            <FiArrowLeft size={16} className="mr-2" /> Back to Home
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteChatroomModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        chatTitle={getChatTitle(deletingChatId)}
      />
    </aside>
  );
};

export default ChatSidebar;
