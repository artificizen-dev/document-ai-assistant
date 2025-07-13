// import React, { useState, useRef, useEffect } from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import Sidebar from "../../Sidebar/Sidebar";
// import Navbar from "../../Navbar/Navbar";
// // import Footer from "../../Dashboard/footer/Footer";
// import { FiLogOut, FiUser, FiMail, FiLogIn } from "react-icons/fi";
// import { useAppContext } from "../../../Providers/AppContext";
// import ROUTES from "../../../routes";
// import Avatar from "boring-avatars";
// import mainLogo from "../../../assets/main-logo.png";

// const DashboardLayout: React.FC = () => {
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   // const location = useLocation();
//   const { user, logout, getUserProfileImage } = useAppContext();
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const profileImage = getUserProfileImage ? getUserProfileImage() : "";

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const CloseSidebar = () => {
//     setSidebarOpen(false);
//   };

//   // const getHeaderTitle = () => {
//   //   if (location.pathname.includes("/evaluate")) {
//   //     return "Document Evaluation";
//   //   }
//   //   if (location.pathname.includes("/learn")) {
//   //     return "Document Learning";
//   //   }
//   //   return "Document AI Assistant";
//   // };

//   const handleLogout = () => {
//     logout();
//     navigate(ROUTES.login);
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-[#DEE4E5] to-[#F1FBE4]">
//       {/* Top Header */}
//       <header className="w-full border-b border-gray-200 px-4 py-1">
//         <div className="flex justify-between items-center py-2">
//           <Link to={ROUTES.home}>
//             <img src={mainLogo} alt="logo" className="h-8" />
//           </Link>

//           {/* User Avatar with Dropdown */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//               className="flex items-center focus:outline-none"
//               aria-expanded={dropdownOpen}
//               aria-haspopup="true"
//             >
//               {profileImage ? (
//                 <img
//                   src={profileImage}
//                   alt="User Profile"
//                   className="w-10 h-10 rounded-full object-cover border border-gray-200"
//                   referrerPolicy="no-referrer"
//                 />
//               ) : (
//                 <Avatar
//                   size={30}
//                   name={user?.username || user?.email || "User"}
//                   variant="beam"
//                   colors={[
//                     "#92A1C6",
//                     "#146A7C",
//                     "#F0AB3D",
//                     "#C271B4",
//                     "#C20D90",
//                   ]}
//                   referrerPolicy="no-referrer"
//                 />
//               )}
//             </button>

//             {/* Dropdown Menu */}
//             {dropdownOpen && (
//               <div className="absolute right-0 mt-2 w-auto rounded-md shadow-lg py-1 z-10 border border-gray-200">
//                 {user ? (
//                   <>
//                     <div className="px-4 py-3 border-b border-gray-100">
//                       <p className="text-sm font-medium text-gray-900 truncate flex items-center">
//                         <FiUser className="mr-2 text-gray-500" />
//                         {user?.username || "User"}
//                       </p>
//                       <p className="text-sm text-gray-500 truncate mt-1 flex items-center">
//                         <FiMail className="mr-2 text-gray-400" />
//                         {user?.email || "No email"}
//                       </p>
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       <FiLogOut className="mr-2 text-gray-500" />
//                       Logout
//                     </button>
//                   </>
//                 ) : (
//                   <button
//                     onClick={() => navigate(ROUTES.login)}
//                     className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     <FiLogIn className="mr-2 text-gray-500" />
//                     Login
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Main Content Area */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <Sidebar isOpen={sidebarOpen} onClose={CloseSidebar} />

//         {/* Main Content with Navbar and Page Content */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Navbar */}
//           <Navbar toggleSidebar={toggleSidebar} />

//           {/* Page Content */}
//           <main className="flex-1 overflow-y-auto">
//             <Outlet />
//           </main>
//         </div>
//       </div>
//       {/* <Footer /> */}
//     </div>
//   );
// };

// export default DashboardLayout;

import React, { useState, useRef, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar/Sidebar";
import { FiLogOut, FiUser, FiMail, FiLogIn, FiPlus } from "react-icons/fi";
import { useAppContext } from "../../../Providers/AppContext";
import ROUTES from "../../../routes";
import mainLogo from "../../../assets/main-logo.png";
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

  return (
    <>
      <div className="flex flex-col h-screen bg-gradient-to-br from-[#DEE4E5] to-[#F1FBE4]">
        {/* Combined Header */}
        <header className="w-full py-4 px-6">
          <div className="flex justify-between items-center max-w-[1800px] mx-auto">
            {/* Left side - Menu Button */}
            <div className="flex items-center gap-4">
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
                <img src={mainLogo} alt="Squirkle" className="h-8" />
              </Link>
            </div>

            {/* Right side - Credits, New evaluation, Grid, Avatar */}
            <div className="flex items-center justify-end gap-4">
              {token && (
                <>
                  {/* Credits */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFFFFF]/80">
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

                  {/* New evaluation button */}
                  <button
                    onClick={() => navigate(ROUTES.evaluate)}
                    disabled={credits?.remaining_credits === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      credits?.remaining_credits === 0
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-[#374151] bg-[#FFFFFF] hover:bg-black/5"
                    }`}
                  >
                    <FiPlus className="w-4 h-4" />
                    <span className="text-sm font-['Funnel_Sans'] font-medium">
                      New evaluation
                    </span>
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
                      className="w-8 h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <button className="p-2 hover:bg-black/5 rounded-lg transition-colors duration-200">
                      <div className="grid grid-cols-3 gap-0.5 w-5 h-5">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-1 bg-[#374151] rounded-sm"
                          ></div>
                        ))}
                      </div>
                    </button>
                  )}
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-auto bg-white rounded-xl shadow-lg py-2 z-10 border border-white/20">
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
