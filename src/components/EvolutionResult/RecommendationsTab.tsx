import React from "react";
import { FiExternalLink, FiBook } from "react-icons/fi";

interface RecommendationsTabProps {
  referenceLinks: string[];
}

const RecommendationsTab: React.FC<RecommendationsTabProps> = ({
  referenceLinks,
}) => {
  if (!referenceLinks || referenceLinks.length === 0) {
    return (
      <div className="text-center py-8">
        <FiBook className="text-gray-400 w-12 h-12 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-600">
          No recommendations available
        </h3>
        <p className="text-gray-500 mt-2">
          There are no reference materials or recommendations for this
          evaluation.
        </p>
      </div>
    );
  }

  const formatLinkText = (url: string) => {
    try {
      // Remove protocol
      let formattedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, "");

      // Truncate if too long
      if (formattedUrl.length > 50) {
        formattedUrl = formattedUrl.substring(0, 47) + "...";
      }

      return formattedUrl;
    } catch (error) {
      return url;
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Recommended References</h3>
      <p className="text-gray-600 mb-6">
        The following resources are recommended to improve your understanding of
        the topic and enhance your answers:
      </p>

      <div className="space-y-4">
        {referenceLinks.map((link, index) => (
          <div
            key={index}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="bg-blue-50 p-2 rounded-full mr-4">
              <FiBook className="text-blue-500" size={20} />
            </div>

            <div className="flex-1">
              <p className="font-medium text-gray-800">Reference {index + 1}</p>
              <p className="text-gray-500 text-sm">{formatLinkText(link)}</p>
            </div>

            <a
              href={link.startsWith("http") ? link : `https://${link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <span className="mr-1">Visit</span>
              <FiExternalLink size={16} />
            </a>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-2">Pro Tip</h4>
        <p className="text-gray-600">
          Make sure to thoroughly review these resources to deepen your
          knowledge on the subject matter. Take notes on key concepts and
          incorporate them into your future answers for better results.
        </p>
      </div>
    </div>
  );
};

export default RecommendationsTab;
