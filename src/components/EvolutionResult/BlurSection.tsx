import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes";

const BlurSection = () => {
  const navigate = useNavigate();
  return (
    <div className="mt-8">
      <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/95 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
          <div className="text-center max-w-md px-6 py-10">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/10 backdrop-blur-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-black"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Unlock Premium Analysis
            </h3>
            <p className="text-gray-600 mb-6">
              Sign in to access detailed scores, personalized feedback, and
              expert recommendations for improving your answer.
            </p>
            <button
              onClick={() => navigate(ROUTES.signup)}
              className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-900 transition-all transform hover:scale-105 shadow-md"
            >
              View Full Analysis
            </button>
          </div>
        </div>

        <div className="opacity-40 pointer-events-none">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium mb-4">
              Detailed Performance Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Understanding", "Content", "Structure"].map((category) => (
                <div
                  key={category}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">
                      {category}
                    </span>
                    <span className="text-lg font-bold">8/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-6">
                <div className="py-2 px-1 border-b-2 border-black font-medium">
                  Document Analysis
                </div>
                <div className="py-2 px-1 text-gray-500">Detailed Feedback</div>
                <div className="py-2 px-1 text-gray-500">
                  Expert Recommendations
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Strength Areas</h4>
                  <div className="mt-2 bg-gray-100 h-16 rounded-md"></div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Improvement Opportunities</h4>
                  <div className="mt-2 bg-gray-100 h-24 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlurSection;
