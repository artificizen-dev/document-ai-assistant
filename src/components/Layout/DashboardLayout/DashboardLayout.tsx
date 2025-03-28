import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar/Sidebar";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Dashboard/footer/Footer";
import { FiLogOut, FiUser, FiMail, FiLogIn } from "react-icons/fi";
import { useAppContext } from "../../../Providers/AppContext";
import ROUTES from "../../../routes";
import Avatar from "boring-avatars";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const CloseSidebar = () => {
    setSidebarOpen(false);
  };

  // Determine the header title based on the current route
  const getHeaderTitle = () => {
    if (location.pathname.includes("/evaluate")) {
      return "Document Evaluation";
    }
    if (location.pathname.includes("/learn")) {
      return "Document Learning";
    }
    return "Document AI Assistant";
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  console.log(user, "the user is");

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex justify-between items-center">
          <h2 className="md:text-2xl text-xl font-medium">
            {getHeaderTitle()}
          </h2>

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
                  referrerpolicy="no-referrer"
                />
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-auto bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                {user ? (
                  <>
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
                  </>
                ) : (
                  <button
                    onClick={() => navigate(ROUTES.login)}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiLogIn className="mr-2 text-gray-500" />
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={CloseSidebar} />

        {/* Main Content with Navbar and Page Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <Navbar toggleSidebar={toggleSidebar} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-white">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
