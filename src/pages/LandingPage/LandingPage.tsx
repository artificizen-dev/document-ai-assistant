import { useNavigate } from "react-router-dom";
import { IoBookOutline } from "react-icons/io5";
import { MdOutlineAssessment } from "react-icons/md";
import { HiArrowRight } from "react-icons/hi";
import Footer from "../../components/Dashboard/footer/Footer";
import { FiLogOut } from "react-icons/fi";
import ROUTES from "../../routes";
import { useAppContext } from "../../Providers/AppContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { logout } = useAppContext();

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

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Choose Your Experience</h2>
            <p className="text-gray-600">
              Upload your documents and interact with them in different ways.
              Learn from your content or get an AI evaluation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Learn Card */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded">
                  <IoBookOutline className="h-6 w-6" />
                </div>
                <h3 className="ml-3 text-xl font-semibold">Learn</h3>
              </div>

              <ul className="ml-6 mb-6 space-y-2 list-disc text-gray-600">
                <li>Ask questions to your content</li>
                <li>Upload documents and chat with them</li>
                <li>Get answers about your content</li>
                <li>Generate insights from conversations</li>
                <li>Access document references</li>
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
                <h3 className="ml-3 text-xl font-semibold">Evaluate</h3>
              </div>

              <ul className="ml-6 mb-6 space-y-2 list-disc text-gray-600">
                <li>Get detailed analysis of content</li>
                <li>Upload documents for AI evaluation</li>
                <li>Get detailed analysis and insight</li>
                <li>View evaluation history</li>
                <li>Generate output documents</li>
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
