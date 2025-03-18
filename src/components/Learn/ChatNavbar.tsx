import React from "react";
import { FiMenu, FiUpload, FiHeadphones, FiX } from "react-icons/fi";

interface ChatNavbarProps {
  toggleSidebar: () => void;
  onUploadDocument: () => void;
  onGeneratePodcast: () => void;
  onClose: () => void;
}

const ChatNavbar: React.FC<ChatNavbarProps> = ({
  toggleSidebar,
  onUploadDocument,
  onGeneratePodcast,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 py-2 px-3">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-3 text-gray-600 hover:text-black p-1 rounded-md hover:bg-gray-100"
        >
          <FiMenu size={20} />
        </button>

        <button
          onClick={onUploadDocument}
          className="flex items-center bg-white border border-gray-200 rounded-md py-1.5 px-3 text-sm text-gray-700 hover:bg-gray-50 mr-2"
        >
          <FiUpload className="mr-2" size={14} />
          Upload Documents
        </button>
      </div>

      <div className="flex items-center">
        <button
          onClick={onGeneratePodcast}
          className="flex items-center mr-2 py-1.5 px-3 text-sm text-gray-700 hover:underline"
        >
          <FiHeadphones className="mr-2" size={14} />
          Generate Podcast
        </button>

        <button
          onClick={onClose}
          className="text-gray-600 hover:text-black p-1 rounded-md hover:bg-gray-100"
        >
          <FiX size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatNavbar;
