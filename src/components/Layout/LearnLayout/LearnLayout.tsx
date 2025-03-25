import React, { useState, useRef, useEffect } from "react";
import ChatArea from "../../Learn/ChatArea";
import ChatSidebar from "../../Learn/ChatSidebar";
import ReferencePanel from "../../Learn/ReferencePanel";
import Footer from "../../Dashboard/footer/Footer";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../routes";
import { useAppContext } from "../../../Providers/AppContext";
import { FiLogOut, FiUser, FiMail } from "react-icons/fi";
import Avatar from "boring-avatars";

const LearnLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showReferencePanel, setShowReferencePanel] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, getUserProfileImage } = useAppContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const profileImage = getUserProfileImage ? getUserProfileImage() : "";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="w-full bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h2 className="md:text-2xl text-xl font-medium">Document Chat</h2>

          {/* User Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center focus:outline-none"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <Avatar
                  size={40}
                  name={user?.username || user?.email || "User"}
                  variant="beam"
                  colors={[
                    "#92A1C6",
                    "#146A7C",
                    "#F0AB3D",
                    "#C271B4",
                    "#C20D90",
                  ]}
                />
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate flex items-center">
                    <FiUser className="mr-2 text-gray-500" />
                    {user?.username || "User"}
                  </p>
                  <p className="text-sm text-gray-500 truncate mt-1 flex items-center">
                    <FiMail className="mr-2 text-gray-400" />
                    {user?.email || "No email"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiLogOut className="mr-2 text-gray-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
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
