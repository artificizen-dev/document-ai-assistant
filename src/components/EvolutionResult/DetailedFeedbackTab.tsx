import React from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { DetailedFeedbackTabProps } from "../../interfaces";

const DetailedFeedbackTab: React.FC<DetailedFeedbackTabProps> = ({
  feedback,
  improvements,
  strengths,
}) => {
  const improvementItems = Object.entries(improvements).map(([key, value]) => ({
    id: key,
    content: value,
  }));
  const strengthItems =
    Object.keys(strengths).length > 0
      ? Object.entries(strengths).map(([key, value]) => ({
          id: key,
          content: value,
        }))
      : [];

  const convertLinksToHTML = (text: string) => {
    if (!text) return "";

    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const htmlWithLinks = text.replace(
      markdownLinkRegex,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>'
    );

    return htmlWithLinks;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Overall Feedback</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-800">{feedback}</p>
        </div>
      </div>

      {/* Strengths Section (if any) */}
      {strengthItems.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <FiCheckCircle className="text-green-500 mr-2" />
            Strengths
          </h3>
          <div className="space-y-4">
            {strengthItems.map((item) => (
              <div
                key={item.id}
                className="bg-green-50 p-4 rounded-md border-l-4 border-green-400"
              >
                <p className="text-gray-800 whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Areas for Improvement */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <FiAlertCircle className="text-amber-500 mr-2" />
          Areas for Improvement
        </h3>
        <div className="space-y-4">
          {improvementItems.map((item) => (
            <div
              key={item.id}
              className="bg-amber-50 p-4 rounded-md border-l-4 border-amber-400"
            >
              <div
                className="text-gray-800 whitespace-pre-line"
                style={{
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
                dangerouslySetInnerHTML={{
                  __html: convertLinksToHTML(item.content),
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedFeedbackTab;
