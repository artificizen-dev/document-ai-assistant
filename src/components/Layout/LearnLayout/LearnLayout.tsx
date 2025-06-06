// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import ChatArea from "../../Learn/ChatArea";
// import ChatSidebar from "../../Learn/ChatSidebar";
// import ReferencePanel from "../../Learn/ReferencePanel";
// import Footer from "../../Dashboard/footer/Footer";
// import ROUTES from "../../../routes";
// import { useAppContext } from "../../../Providers/AppContext";
// import { FiLogOut, FiUser, FiMail, FiLogIn } from "react-icons/fi";
// import Avatar from "boring-avatars";
// import { access_token, backendURL } from "../../../utils/constants";
// import ChatNavbar from "../../Learn/ChatNavbar";

// const LearnLayout: React.FC = () => {
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [showReferencePanel, setShowReferencePanel] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [chatroomId, setChatroomId] = useState<string | null>(null);
//   const [isCreatingChatroom, setIsCreatingChatroom] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout, getUserProfileImage } = useAppContext();
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const token = access_token();

//   const profileImage = getUserProfileImage ? getUserProfileImage() : "";

//   useEffect(() => {
//     const searchParams = new URLSearchParams(location.search);
//     const urlChatroomId = searchParams.get("chatroom_id");

//     if (urlChatroomId) {
//       setChatroomId(urlChatroomId);
//     } else if (user && !isCreatingChatroom && !chatroomId) {
//       createInitialChatroom();
//     }
//   }, [location.search, user]);

//   const createInitialChatroom = async () => {
//     if (!user || isCreatingChatroom) return;

//     setIsCreatingChatroom(true);
//     try {
//       const response = await axios.post(
//         `${backendURL}/api/chat/chatroom/`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const newChatroomId = response.data.id;
//       setChatroomId(newChatroomId);
//       navigate(`${location.pathname}?chatroom_id=${newChatroomId}`, {
//         replace: true,
//       });
//     } catch (error) {
//       console.error("Failed to create initial chatroom:", error);
//     } finally {
//       setIsCreatingChatroom(false);
//     }
//   };

//   const handleSelectChatroom = (selectedChatroomId: string) => {
//     setChatroomId(selectedChatroomId);
//     navigate(`${location.pathname}?chatroom_id=${selectedChatroomId}`, {
//       replace: true,
//     });
//   };

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

//   const handleLogout = () => {
//     logout();
//     navigate(ROUTES.login);
//   };

//   return (
//     // <div className="flex flex-col h-screen">
//     //   <header className="w-full bg-white border-b border-gray-200 p-4">
//     //     <div className="flex justify-between items-center">
//     //       <h2 className="md:text-2xl text-xl font-medium">Document Chat</h2>

//     //       {/* User Avatar with Dropdown */}
//     //       <div className="relative" ref={dropdownRef}>
//     //         <button
//     //           onClick={() => setDropdownOpen(!dropdownOpen)}
//     //           className="flex items-center focus:outline-none"
//     //           aria-expanded={dropdownOpen}
//     //           aria-haspopup="true"
//     //         >
//     //           {profileImage ? (
//     //             <img
//     //               src={profileImage}
//     //               alt="User Profile"
//     //               className="w-10 h-10 rounded-full object-cover border border-gray-200"
//     //               referrerPolicy="no-referrer"
//     //             />
//     //           ) : (
//     //             <Avatar
//     //               size={40}
//     //               name={user?.username || user?.email || "User"}
//     //               variant="beam"
//     //               colors={[
//     //                 "#92A1C6",
//     //                 "#146A7C",
//     //                 "#F0AB3D",
//     //                 "#C271B4",
//     //                 "#C20D90",
//     //               ]}
//     //               referrerPolicy="no-referrer"
//     //             />
//     //           )}
//     //         </button>

//     //         {/* Dropdown Menu */}
//     //         {dropdownOpen && (
//     //           <div className="absolute right-0 mt-2 w-auto bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
//     //             {user ? (
//     //               <>
//     //                 <div className="px-4 py-3 border-b border-gray-100">
//     //                   <p className="text-sm font-medium text-gray-900 truncate flex items-center">
//     //                     <FiUser className="mr-2 text-gray-500" />
//     //                     {user?.username || "User"}
//     //                   </p>
//     //                   <p className="text-sm text-gray-500 truncate mt-1 flex items-center">
//     //                     <FiMail className="mr-2 text-gray-400" />
//     //                     {user?.email || "No email"}
//     //                   </p>
//     //                 </div>
//     //                 <button
//     //                   onClick={handleLogout}
//     //                   className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//     //                 >
//     //                   <FiLogOut className="mr-2 text-gray-500" />
//     //                   Logout
//     //                 </button>
//     //               </>
//     //             ) : (
//     //               <button
//     //                 onClick={() => navigate(ROUTES.login)}
//     //                 className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//     //               >
//     //                 <FiLogIn className="mr-2 text-gray-500" />
//     //                 Login
//     //               </button>
//     //             )}
//     //           </div>
//     //         )}
//     //       </div>
//     //     </div>
//     //   </header>

//     //   <div className="flex flex-1 overflow-hidden">
//     //     {/* Left Sidebar - Chat list */}
//     //     <ChatSidebar
//     //       isVisible={showSidebar}
//     //       onClose={() => setShowSidebar(false)}
//     //       onSelectChatroom={handleSelectChatroom}
//     //       currentChatroomId={chatroomId}
//     //     />

//     //     {/* Main Chat Area */}
//     //     <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200 h-full">
//     //       <ChatNavbar
//     //         toggleSidebar={() => setShowSidebar(!showSidebar)}
//     //         onGeneratePodcast={() => console.log("Generate podcast")}
//     //       />
//     //       <ChatArea
//     //         toggleReferencePanel={() =>
//     //           setShowReferencePanel(!showReferencePanel)
//     //         }
//     //         chatroomId={chatroomId}
//     //       />
//     //     </div>

//     //     {/* Right panel - References */}
//     //     <ReferencePanel
//     //       isVisible={showReferencePanel}
//     //       onClose={() => setShowReferencePanel(false)}
//     //     />
//     //   </div>
//     //   <Footer />
//     // </div>
//     <div className="flex flex-col h-screen">
//       {/* Header - Fixed at the top */}
//       <header className="w-full bg-white border-b border-gray-200 p-4 fixed top-0 left-0 right-0 z-40">
//         <div className="flex justify-between items-center">
//           <h2 className="md:text-2xl text-xl font-medium">Document Chat</h2>

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
//                   size={40}
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
//               <div className="absolute right-0 mt-2 w-auto bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
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

//       {/* Main Content Area - Adjusted for fixed header */}
//       <div className="flex flex-1 overflow-hidden mt-16">
//         {/* Left Sidebar - Chat list */}
//         <ChatSidebar
//           isVisible={showSidebar}
//           onClose={() => setShowSidebar(false)}
//           onSelectChatroom={handleSelectChatroom}
//           currentChatroomId={chatroomId}
//         />
//         {/* Main Chat Area - Includes ChatNavbar within the content area */}
//         <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200 h-full mt-2">
//           <ChatNavbar
//             toggleSidebar={() => setShowSidebar(!showSidebar)}
//             onGeneratePodcast={() => console.log("Generate podcast")}
//           />
//           <ChatArea
//             toggleReferencePanel={() =>
//               setShowReferencePanel(!showReferencePanel)
//             }
//             chatroomId={chatroomId}
//           />
//         </div>
//         {/* Right panel - References */}
//         <ReferencePanel
//           isVisible={showReferencePanel}
//           onClose={() => setShowReferencePanel(false)}
//         />
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default LearnLayout;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatArea from "../../Learn/ChatArea";
import ChatSidebar from "../../Learn/ChatSidebar";
import ReferencePanel from "../../Learn/ReferencePanel";
// import Footer from "../../Dashboard/footer/Footer";
import ROUTES from "../../../routes";
import { useAppContext } from "../../../Providers/AppContext";
import { FiLogOut, FiUser, FiMail, FiLogIn } from "react-icons/fi";
import Avatar from "boring-avatars";
import ChatNavbar from "../../Learn/ChatNavbar";

const LearnLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showReferencePanel, setShowReferencePanel] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const { user, logout, getUserProfileImage } = useAppContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header - Fixed at the top */}
      <header className="w-full bg-white border-b border-gray-200 px-4 py-1 fixed top-0 left-0 right-0 z-40">
        <div className="flex justify-end items-center">
          {/* <h2 className="md:text-2xl text-xl font-medium">Document Chat</h2> */}

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
                  referrerPolicy="no-referrer"
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
                  referrerPolicy="no-referrer"
                />
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-auto bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
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

      {/* Main Content Area - Adjusted for fixed header */}
      <div className="flex flex-1 overflow-hidden mt-10">
        {/* Left Sidebar - Chat list */}
        <ChatSidebar
          isVisible={showSidebar}
          onClose={() => setShowSidebar(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200 h-full mt-2">
          <ChatNavbar
            toggleSidebar={() => setShowSidebar(!showSidebar)}
            onGeneratePodcast={() => console.log("Generate podcast")}
          />
          <ChatArea
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
      {/* <Footer /> */}
    </div>
  );
};

export default LearnLayout;
