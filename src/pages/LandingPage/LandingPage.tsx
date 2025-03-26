import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoBookOutline } from "react-icons/io5";
import { MdOutlineAssessment } from "react-icons/md";
import { HiArrowRight } from "react-icons/hi";
import { FiLogOut, FiUser, FiMail, FiLogIn } from "react-icons/fi";
import Footer from "../../components/Dashboard/footer/Footer";
import ROUTES from "../../routes";
import { useAppContext } from "../../Providers/AppContext";
import Avatar from "boring-avatars";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout, getUserProfileImage } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h2 className="md:text-2xl text-xl font-medium">
            Document AI Assistant
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Choose Your Experience</h2>
            <p className="text-gray-600">
              Engage with AI to deepen your learning or receive expert-grade
              evaluations tailored to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Learn Card */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded">
                  <IoBookOutline className="h-6 w-6" />
                </div>
                <h3 className="ml-3 text-xl font-semibold">
                  Learn - Your AI Study Companion
                </h3>
              </div>

              <ul className="ml-6 mb-6 space-y-2 list-disc text-gray-600">
                <li>Get expert guidance on any subject</li>
                <li>Ask questions about your documents</li>
                <li>Receive clear, comprehensive answers</li>
                <li>Gain deep insights from your content</li>
                <li>Master complex topics with personalized help</li>
              </ul>

              <button
                onClick={() => navigate("/learn/chat/new")}
                className="w-full bg-black text-white py-2 px-4 rounded flex items-center justify-center"
              >
                Start Learning
                <HiArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>

            {/* Evaluate Card */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded">
                  <MdOutlineAssessment className="h-6 w-6" />
                </div>
                <h3 className="ml-3 text-xl font-semibold">
                  Evaluate - Your AI Grading Assistant
                </h3>
              </div>

              <ul className="ml-6 mb-6 space-y-2 list-disc text-gray-600">
                <li>Get instant grading on your answers</li>
                <li>Receive detailed, insightful feedback</li>
                <li>Understand your strengths and weaknesses</li>
                <li>Learn from expert-level evaluations</li>
                <li>Improve your answers with targeted suggestions</li>
              </ul>

              <button
                onClick={() => navigate("/evaluate")}
                className="w-full bg-black text-white py-2 px-4 rounded flex items-center justify-center"
              >
                Start Evaluating
                <HiArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
