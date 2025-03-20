import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar/Sidebar";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Dashboard/footer/Footer";
import { FiLogOut } from "react-icons/fi";
import { useAppContext } from "../../../Providers/AppContext";
import ROUTES from "../../../routes";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { logout } = useAppContext();

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

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h2 className="md:text-2xl text-xl font-medium">
            {getHeaderTitle()}
          </h2>

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
