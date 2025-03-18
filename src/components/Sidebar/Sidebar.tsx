import React from "react";
import { FiX } from "react-icons/fi";
import { useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const path = location.pathname;

  const isEvaluatePage = path.includes("/evaluate");
  const isLearnPage = path.includes("/learn");

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 md:relative absolute md:h-auto h-full ${
        isOpen ? "md:w-70 w-60" : "w-0 overflow-hidden"
      }`}
    >
      <button
        onClick={onClose}
        className="md:hidden absolute top-3 right-3 text-gray-500 hover:text-black"
        aria-label="Close sidebar"
      >
        <FiX size={20} />
      </button>
      <div className="flex flex-col h-full">
        {/* Sidebar content for evaluation page */}
        {isEvaluatePage && (
          <div className="flex pt-[20%] justify-center h-full">
            <p className="text-gray-500 text-sm">No evaluation history yet</p>
          </div>
        )}

        {/* Sidebar content for learn page */}
        {isLearnPage && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">No conversation history yet</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
