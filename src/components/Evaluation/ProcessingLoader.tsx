import { useEffect, useState } from "react";
import { FiClock, FiFileText } from "react-icons/fi";

const ProcessingLoader: React.FC<{ documents: any }> = ({ documents }) => {
  const [, forceUpdate] = useState({});
  const processingDocs = Object.values(documents).filter(
    (doc: any) => doc.status === "processing"
  );

  // Force component to update every second to refresh the time display
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate({});
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time since upload started
  const formatTimeSince = (startTime: number) => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    return `${Math.floor(seconds / 3600)} hours`;
  };

  return (
    <div className="w-full h-full flex items-center justify-center py-10">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 mb-4">
            <div className="absolute inset-0 border-t-4 border-gray-200 rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-t-4 border-black rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FiFileText className="w-10 h-10 text-gray-700" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-center">
            Evaluating Documents
          </h2>
          <p className="text-gray-500 text-center mt-2">
            We're analyzing your documents. This may take a few minutes.
          </p>
        </div>

        <div className="space-y-3 mt-6">
          {processingDocs.map((doc: any) => (
            <div
              key={doc.name}
              className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200"
            >
              <FiClock className="text-yellow-500 mr-3" />
              <div className="flex-1">
                <p className="font-medium text-sm truncate">{doc.name}</p>
                <p className="text-xs text-gray-500">
                  Processing for {formatTimeSince(doc.startTime)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          You can navigate to other parts of the application while we process
          your documents. We'll notify you when they're ready.
        </p>
      </div>
    </div>
  );
};

export default ProcessingLoader;
