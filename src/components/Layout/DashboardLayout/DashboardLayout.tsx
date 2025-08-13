import React, { useState, useRef, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar/Sidebar";
import { FiLogOut, FiUser, FiMail, FiLogIn, FiPlus } from "react-icons/fi";
import { useAppContext } from "../../../Providers/AppContext";
import ROUTES from "../../../routes";
import mainLogo from "../../../assets/Logo.svg";
import { access_token } from "../../../utils/constants";
import BuyCreditsModal from "../../Payment/BuyCreditsModal/BuyCreditsModal";
import { VscLayoutSidebarRightOff } from "react-icons/vsc";
import coins from "../../../assets/coins2.png";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const {
    user,
    logout,
    getUserProfileImage,
    credits,
    isLoadingCredits,
    fetchCredits,
  } = useAppContext();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const token = access_token();

  const profileImage = getUserProfileImage ? getUserProfileImage() : "";

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

  useEffect(() => {
    if (token) {
      fetchCredits();
    }
  }, [token]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const CloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  const handleCloseBuyModal = () => {
    setShowBuyModal(false);
    fetchCredits();
  };

  // const handleBuyCredits = () => {
  //   setShowBuyModal(true);
  // };

  return (
    <>
      <div className="flex flex-col h-screen bg-gradient-to-br from-[#DEE4E5] to-[#F1FBE4]">
        {/* Combined Header */}
        <header className="w-full py-4 px-4 sm:px-6">
          <div className="flex justify-between items-center max-w-[1800px] mx-auto">
            {/* Left side - Menu Button */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleSidebar}
                className="flex items-center gap-2 p-2 hover:bg-black/5 rounded-lg transition-colors duration-200"
              >
                <VscLayoutSidebarRightOff className="w-5 h-5 text-[#374151]" />
              </button>
            </div>

            {/* Center - Logo */}
            <div className="flex items-center">
              <Link to={ROUTES.home} className="flex items-center">
                <img src={mainLogo} alt="Squirkle" />
              </Link>
            </div>

            {/* Right side - Credits, New evaluation, Grid, Avatar */}
            <div className="flex items-center justify-end gap-2 sm:gap-4">
              {token && (
                <>
                  {/* Credits - Hidden on mobile, show on sm+ */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFFFFF]/80">
                    <img src={coins} alt="coins" />
                    <span className="text-sm font-['Funnel_Sans'] font-medium text-[#374151]">
                      {isLoadingCredits ? (
                        <div className="animate-pulse">
                          <div className="w-8 h-3 bg-gray-300 rounded"></div>
                        </div>
                      ) : credits ? (
                        <>
                          <span className="text-gray-900 font-medium text-sm">
                            {credits.remaining_credits}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {" "}
                            Credits
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">--/--</span>
                      )}
                    </span>
                  </div>

                  {/* Mobile Credits - Show only number */}
                  <div className="flex sm:hidden items-center gap-1 px-2 py-1 rounded-lg bg-[#FFFFFF]/80">
                    <img src={coins} alt="coins" className="w-4 h-4" />
                    <span className="text-xs font-['Funnel_Sans'] font-medium text-[#374151]">
                      {isLoadingCredits ? (
                        <div className="animate-pulse">
                          <div className="w-6 h-2 bg-gray-300 rounded"></div>
                        </div>
                      ) : credits ? (
                        <span className="text-gray-900 font-medium">
                          {credits.remaining_credits}
                        </span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </span>
                  </div>

                  {/* New evaluation button */}
                  {/* {credits?.remaining_credits === 0 ? (
                    <button
                      onClick={handleBuyCredits}
                      className="bg-red-500 text-white px-2 sm:px-4 py-1 md:py-1.5 rounded-md text-xs sm:text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      <span className="hidden sm:inline">Buy Now</span>
                      <span className="sm:hidden">Buy</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(ROUTES.evaluate)}
                      className="flex items-center bg-[#FFFFFF] hover:bg-gray-300 py-1 md:py-2 px-1 sm:px-2 rounded-md transition-all duration-200 border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300"
                    >
                      <FiPlus size={16} className="mr-0 sm:mr-1" />
                      <span className="hidden sm:inline text-sm">
                        New Evaluation
                      </span>
                    </button>
                  )} */}
                  <button
                    onClick={() => navigate(ROUTES.evaluate)}
                    disabled={credits?.remaining_credits === 0}
                    className={`flex items-center py-1 px-1 rounded-md transition-all duration-200 border ${
                      credits?.remaining_credits === 0
                        ? "border-gray-100 text-gray-300 cursor-not-allowed"
                        : "border-gray-200 text-gray-600 hover:text-black hover:border-gray-300"
                    }`}
                  >
                    <FiPlus size={16} className="mr-1" /> New Evaluation
                  </button>
                </>
              )}

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
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <button className="p-1.5 sm:p-2 hover:bg-black/5 rounded-lg transition-colors duration-200">
                      <div className="grid grid-cols-3 gap-0.5 w-4 h-4 sm:w-5 sm:h-5">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#374151] rounded-sm"
                          ></div>
                        ))}
                      </div>
                    </button>
                  )}
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-auto min-w-[200px] bg-white rounded-xl shadow-lg py-2 z-10 border border-white/20">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-['Funnel_Sans'] font-medium text-[#1F2937] truncate flex items-center">
                            <FiUser className="mr-2 text-[#6B7280]" />
                            {user?.username || "User"}
                          </p>
                          <p className="text-sm font-['Funnel_Sans'] text-[#6B7280] truncate mt-1 flex items-center">
                            <FiMail className="mr-2 text-[#9CA3AF]" />
                            {user?.email || "No email"}
                          </p>
                        </div>

                        {/* Mobile Credits in Dropdown */}
                        <div className="sm:hidden px-4 py-2 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-['Funnel_Sans'] text-[#6B7280]">
                              Credits
                            </span>
                            <div className="flex items-center gap-1">
                              <img
                                src={coins}
                                alt="coins"
                                className="w-4 h-4"
                              />
                              <span className="text-sm font-['Funnel_Sans'] font-medium text-[#374151]">
                                {isLoadingCredits ? (
                                  <div className="animate-pulse">
                                    <div className="w-8 h-3 bg-gray-300 rounded"></div>
                                  </div>
                                ) : credits ? (
                                  <>
                                    <span className="text-gray-900 font-medium">
                                      {credits.remaining_credits}
                                    </span>
                                    <span className="text-gray-400">
                                      {" "}
                                      Credits
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-gray-400">--/--</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm font-['Funnel_Sans'] text-[#374151] hover:bg-gray-50"
                        >
                          <FiLogOut className="mr-2 text-[#6B7280]" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate(ROUTES.login)}
                        className="flex w-full items-center px-4 py-2 text-sm font-['Funnel_Sans'] text-[#374151] hover:bg-gray-50"
                      >
                        <FiLogIn className="mr-2 text-[#6B7280]" />
                        Login
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={CloseSidebar} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Page Content */}
            <main className="flex-1 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      {/* Buy Credits Modal */}
      <BuyCreditsModal isOpen={showBuyModal} onClose={handleCloseBuyModal} />
    </>
  );
};

export default DashboardLayout;
