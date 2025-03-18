import React from "react";
import { FiFileText, FiExternalLink, FiDownload } from "react-icons/fi";

interface ReferenceItemProps {
  title: string;
  date: string;
  relevance: "high" | "medium" | "low";
}

const ReferenceItem: React.FC<ReferenceItemProps> = ({
  title,
  date,
  relevance,
}) => {
  // Get badge color based on relevance
  const getBadgeColor = () => {
    switch (relevance) {
      case "high":
        return "bg-black text-white";
      case "medium":
        return "bg-gray-500 text-white";
      case "low":
        return "bg-gray-300 text-gray-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="border border-gray-200 rounded-md p-3 mb-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start">
          <div className="text-gray-500 mr-3 flex-shrink-0">
            <FiFileText size={20} />
          </div>
          <div>
            <h3 className="font-medium text-xs leading-tight">{title}</h3>
            <div className="flex items-center mt-1">
              <span className="text-gray-500 text-xs mr-2">
                Referenced: {date}
              </span>
            </div>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded ${getBadgeColor()}`}>
          {relevance.charAt(0).toUpperCase() + relevance.slice(1)}
        </span>
      </div>

      <div className="flex mt-2 pt-2 border-t border-gray-100">
        <button className="flex items-center text-xs text-gray-600 mr-3 hover:text-black">
          <span className="mr-1">Open</span>
        </button>

        <button className="flex items-center text-xs text-gray-600 mr-3 hover:text-black">
          <FiExternalLink size={12} className="mr-1" /> Link
        </button>

        <button className="flex items-center text-xs text-gray-600 hover:text-black">
          <FiDownload size={12} className="mr-1" /> Download
        </button>
      </div>
    </div>
  );
};

export default ReferenceItem;
