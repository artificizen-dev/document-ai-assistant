import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiArrowLeft, FiPlus } from "react-icons/fi";
import ROUTES from "../../routes";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  // Check if current page is evaluation or learn page
  const isEvaluatePage = path.includes("/evaluate");
  const isLearnPage = path.includes("/learn");

  return (
    <nav className="bg-white border-b border-gray-200 py-3 px-4">
      <div className="flex items-center justify-between">
        {/* Left side - Menu toggle and Back button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-black"
            aria-label="Toggle Sidebar"
          >
            <FiMenu size={20} />
          </button>

          <button
            onClick={() => navigate(ROUTES.default)}
            className="flex items-center text-gray-600 hover:text-black"
          >
            <FiArrowLeft size={16} className="mr-2" /> Back to Home
          </button>
        </div>

        {/* Right side - Action buttons */}
        <div>
          {isEvaluatePage && (
            <button className="flex items-center border-[1px] border-gray-200 py-1 px-1 rounded-md text-gray-600 hover:text-black">
              <FiPlus size={16} className="mr-1" /> New Evaluation
            </button>
          )}

          {isLearnPage && (
            <button className="flex items-center text-gray-600 hover:text-black">
              <FiPlus size={16} className="mr-1" /> New Conversation
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
