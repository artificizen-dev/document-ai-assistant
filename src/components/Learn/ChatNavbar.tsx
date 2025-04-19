import React from "react";
// import { FiArrowLeft } from "react-icons/fi";
// import ROUTES from "../../routes";
// import { useNavigate } from "react-router-dom";
import { LuPanelLeft } from "react-icons/lu";

interface ChatNavbarProps {
  toggleSidebar: () => void;
  onGeneratePodcast: () => void;
}

const ChatNavbar: React.FC<ChatNavbarProps> = ({ toggleSidebar }) => {
  // const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 py-2 px-3">
      <div className="flex items-center gap-1">
        <button
          onClick={toggleSidebar}
          className="mr-3 text-gray-600 hover:text-black p-1 rounded-md hover:bg-gray-100"
        >
          <LuPanelLeft size={20} />
        </button>
        {/* <button
          onClick={() => navigate(ROUTES.default)}
          className="flex items-center text-gray-600 hover:text-black"
        >
          <FiArrowLeft size={16} className="mr-2" /> Back to Home
        </button> */}
      </div>
    </div>
  );
};

export default ChatNavbar;
