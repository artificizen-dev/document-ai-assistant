import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogIn, FiX } from "react-icons/fi";
import ROUTES from "../../routes";
import { LoginModalProps } from "../../interfaces";

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    navigate(ROUTES.login);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Login Required
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <FiLogIn size={32} className="text-gray-500" />
            </div>
          </div>

          <p className="text-gray-700 text-center mb-6">
            You need to be logged in to send messages and interact with AI
            Assistant.
          </p>

          <div className="flex justify-center">
            <button
              onClick={handleLogin}
              className="bg-black text-white py-2 px-6 rounded-full flex items-center justify-center transition-colors hover:bg-gray-800"
            >
              <FiLogIn className="mr-2" />
              Login Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
