import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiUser, FiMail, FiLogIn, FiPlus } from "react-icons/fi";
import ROUTES from "../../routes";
import { useAppContext } from "../../Providers/AppContext";
import mainLogo from "../../assets/main-logo.png";
import LayoutFooter from "../../components/LayoutFooter/LayoutFooter";
import coins from "../../assets/coins2.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const {
    user,
    logout,
    getUserProfileImage,
    evaluations,
    fetchEvaluations,
    isLoadingEvaluations,
    // fetchChatrooms,
    // isLoadingChatrooms,
    chatrooms,
    credits,
    fetchCredits,
    isLoadingCredits,
  } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  useEffect(() => {
    if (user) {
      fetchEvaluations();
      fetchCredits();
    }
  }, [user]);

  const handleStartLearning = async () => {
    if (chatrooms && chatrooms.length > 0) {
      navigate(`${ROUTES.chat}?chatroom_id=${chatrooms[0].id}`);
    } else {
      navigate(ROUTES.chat);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DEE4E5] to-[#F1FBE4] flex flex-col relative">
      {/* Header */}
      <header className="w-full py-4 px-6">
        <div className="flex justify-between items-center max-w-[1350px] mx-auto">
          {/* Left side - Empty space for balance */}
          <div className="flex-1"></div>

          {/* Center - Logo */}
          <div className="flex items-center">
            <Link to={ROUTES.home} className="flex items-center">
              <img src={mainLogo} alt="Squirkle" className="h-8" />
            </Link>
          </div>

          {/* Right side - Credits, New evaluation, Grid, Avatar */}
          <div className="flex-1 flex items-center justify-end gap-4">
            {/* Credits */}
            {user && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
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
                      <span className="text-gray-400 text-sm"> Credits</span>
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">--/--</span>
                  )}
                </span>
              </div>
            )}

            {/* New evaluation button */}
            <button
              onClick={() => navigate("/evaluate")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFFFFF] hover:bg-black/5 transition-colors duration-200"
            >
              <FiPlus className="w-4 h-4 text-[#374151]" />
              <span className="text-sm font-['Funnel_Sans'] font-medium text-[#374151]">
                New evaluation
              </span>
            </button>

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

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-4xl w-full">
          {/* Header Text */}
          <div className="text-center mb-16">
            <h1 className="text-[40px] font-['Funnel_Sans'] font-medium text-[#1F2937] mb-4">
              Choose your experience
            </h1>
            <p className="text-[14px] font-['Funnel_Sans'] text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              Engage with AI to deepen your learning or receive <br />{" "}
              expert-grade evaluations tailored to your needs.
            </p>
          </div>

          {/* Cards Container */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto bg-[#ECECEC]/70 md:p-6 rounded-2xl relative shadow-lg">
            {/* Learn Card */}
            <div className="absolute -top-3 left-6">
              <span className="bg-[#84cc16] text-white text-xs font-['Funnel_Sans'] font-medium px-3 py-1 rounded-full">
                COMING SOON
              </span>
            </div>
            <div className="relative bg-[#E2E2E2]/70 backdrop-blur-sm rounded-2xl p-4  transition-all duration-300 flex flex-col h-full">
              <div className="mb-4">
                <h2 className="text-[40px] font-['Funnel_Sans'] font-bold text-[#1F2937] mb-2">
                  Learn
                </h2>
                <p className="text-[22px] text-[#9CA3AF] font-['Funnel_Sans'] mb-6">
                  Your AI Study Companion
                </p>
              </div>

              <div className="border-[1px] border-[#d8d5d5] rounded-xl py-6 px-4 bg-[#E2E2E2] ">
                <p className="text-[#414651] text-[14px] font-['Funnel_Sans'] text-base leading-relaxed mb-8 flex-grow">
                  Get expert guidance, clear answers, and deep insights to
                  master any subject.
                </p>

                <div className="mt-auto">
                  <button
                    onClick={handleStartLearning}
                    disabled
                    className="w-full bg-[#E5E7EB] text-[#9CA3AF] py-3 px-6 rounded-xl font-['Funnel_Sans'] font-medium transition-all duration-200 cursor-not-allowed"
                  >
                    Coming soon
                  </button>
                </div>
              </div>
            </div>

            {/* Evaluate Card */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-4 hover:bg-white/80 transition-all duration-300 flex flex-col h-full shadow-lg">
              <div className="mb-6">
                <h2 className="text-[40px] font-['Funnel_Sans'] font-bold text-[#204336] mb-2">
                  Evaluate
                </h2>
                <p className="text-[22px] text-[#9CA3AF] font-['Funnel_Sans'] mb-4">
                  Your AI Grading Assistant
                </p>
              </div>
              <div className="border-[1px] border-[#D1D5DB] rounded-xl py-6 px-4 bg-[#E2E2E2]/70 ">
                <p className="text-[#6B7280] font-['Funnel_Sans'] text-[14px] leading-relaxed mb-8 flex-grow">
                  Get instant grading, insightful feedback, and expert-level
                  evaluation to improve your answers.
                </p>

                <div className="mt-auto">
                  <button
                    onClick={() => {
                      if (evaluations && evaluations.length > 0) {
                        navigate(`/evaluation-summary/${evaluations[0].id}`);
                      } else {
                        navigate("/evaluate");
                      }
                    }}
                    disabled={isLoadingEvaluations}
                    className="w-full text-[16px] bg-[#204336] text-[#CBFB93] py-3 px-6 rounded-xl font-['Funnel_Sans'] font-medium hover:bg-[#111827] transition-all duration-200 flex items-center justify-center"
                  >
                    {isLoadingEvaluations ? "Loading..." : "Start Evaluating"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <LayoutFooter />
    </div>
  );
};

export default LandingPage;
