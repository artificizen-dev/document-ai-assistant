import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiArrowLeft, FiPlus } from "react-icons/fi";
import ROUTES from "../../routes";
import { access_token } from "../../utils/constants";
import { useAppContext } from "../../Providers/AppContext";
import { RiCoinsLine } from "react-icons/ri";
import BuyCreditsModal from "../Payment/BuyCreditsModal/BuyCreditsModal";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const token = access_token();
  const { credits, isLoadingCredits, fetchCredits } = useAppContext();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const isProduction = import.meta.env.VITE_ENVIRONMENT === "production";

  useEffect(() => {
    fetchCredits();
  }, []);

  // const handleBuyCredits = () => {
  //   setShowBuyModal(true);
  // };

  const handleCloseBuyModal = () => {
    setShowBuyModal(false);
    // Refresh credits after modal closes
    fetchCredits();
  };

  return (
    <>
      <nav className=" border-b border-gray-200 py-3 px-4">
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
              onClick={() =>
                navigate(isProduction ? ROUTES.home : ROUTES.default)
              }
              className="flex items-center text-gray-600 hover:text-black"
            >
              <FiArrowLeft size={16} className="mr-2" /> Back to Home
            </button>
          </div>

          {token && (
            <div className="flex items-center space-x-4">
              {/* Credits Display */}
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
                <RiCoinsLine className="w-4 h-4 text-gray-600" />
                <div className="flex items-center space-x-1">
                  {isLoadingCredits ? (
                    <div className="animate-pulse">
                      <div className="w-8 h-3 bg-gray-300 rounded"></div>
                    </div>
                  ) : credits ? (
                    <>
                      <span className="text-gray-900 font-medium text-sm">
                        {credits.remaining_credits}
                      </span>
                      <span className="text-gray-400 text-sm">/</span>
                      <span className="text-gray-500 text-sm">
                        {credits.total_credits}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">--/--</span>
                  )}
                </div>
                <span className="text-gray-500 text-xs">Credits</span>
              </div>

              {/* Buy Now Button or New Evaluation Button */}
              {/* {credits?.remaining_credits === 0 ? (
                <button
                  onClick={handleBuyCredits}
                  className="bg-red-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Buy Now
                </button>
              ) : (
                <button
                  onClick={() => navigate(ROUTES.evaluate)}
                  className="flex items-center py-1 px-1 rounded-md transition-all duration-200 border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300"
                >
                  <FiPlus size={16} className="mr-1" /> New Evaluation
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
            </div>
          )}
        </div>
      </nav>

      {/* Buy Credits Modal */}
      <BuyCreditsModal isOpen={showBuyModal} onClose={handleCloseBuyModal} />
    </>
  );
};

export default Navbar;
