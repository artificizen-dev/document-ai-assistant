import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../Sidebar/Sidebar";
import Navbar from "../../Navbar/Navbar";

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

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

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-gray-200 p-4">
        <h2 className="text-2xl font-medium">{getHeaderTitle()}</h2>
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
    </div>
  );
};

export default DashboardLayout;
