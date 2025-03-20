import React, { useState } from "react";
import ChatArea from "../../Learn/ChatArea";
import ChatSidebar from "../../Learn/ChatSidebar";
import ReferencePanel from "../../Learn/ReferencePanel";
import Footer from "../../Dashboard/footer/Footer";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../routes";
import { useAppContext } from "../../../Providers/AppContext";
import { FiLogOut } from "react-icons/fi";

const LearnLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showReferencePanel, setShowReferencePanel] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAppContext();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="w-full bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h2 className="md:text-2xl text-xl font-medium">Document Chat</h2>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50"
            aria-label="Logout"
          >
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Chat list */}
        <ChatSidebar
          isVisible={showSidebar}
          onClose={() => setShowSidebar(false)}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200">
          <ChatArea
            toggleSidebar={() => setShowSidebar(!showSidebar)}
            toggleReferencePanel={() =>
              setShowReferencePanel(!showReferencePanel)
            }
          />
        </div>

        {/* Right panel - References */}
        <ReferencePanel
          isVisible={showReferencePanel}
          onClose={() => setShowReferencePanel(false)}
        />
      </div>
      <Footer />
    </div>
  );
};

export default LearnLayout;
