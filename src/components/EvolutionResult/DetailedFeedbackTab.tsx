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

  const cleanText = (text: string) => {
    if (!text) return "";

    // Remove malformed HTML and extract URLs
    let cleaned = text;

    // Remove malformed HTML link structures
    cleaned = cleaned.replace(
      /\*+([^\*]+)\*+"[^"]+"[^"]+"[^"]+">\*+([^\*]+)\*+/g,
      "$1"
    );

    // Remove standalone asterisks
    cleaned = cleaned.replace(/\*{2,}/g, "");

    // Clean up "Links:" text
    cleaned = cleaned.replace(/Links:\s*\*/g, "Links:");

    // Extract and clean URLs
    const urlPattern = /(www\.[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+(?:\/[^\s)]*)?)/g;
    const urls = cleaned.match(urlPattern) || [];

    // Replace the Links section with a clean list of URLs
    if (urls.length > 0) {
      const linksSection = cleaned.indexOf("Links:");
      if (linksSection !== -1) {
        const textBeforeLinks = cleaned.substring(0, linksSection);

        let formattedLinks = "<p>Links:</p><ul class='pl-5 mt-2 list-disc'>";
        urls.forEach((url) => {
          formattedLinks += `<li><a href="https://${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${url}</a></li>`;
        });
        formattedLinks += "</ul>";

        return textBeforeLinks + formattedLinks;
      }
    }

    return cleaned;
  };

  const formatFeedbackContent = (content: string) => {
    if (!content) return "";

    const lines = content.split("\n");
    const formattedLines = lines.map((line) => {
      if (line.trim().startsWith("*")) {
        const scoreParts = line.match(/\*\s+(.*?):\s+(\d+)\/(\d+)/);
        if (scoreParts) {
          const [_, category, score, total] = scoreParts;
          return `<div class="my-1"><span class="font-medium">${category}:</span> <strong class="text-blue-700">${score}/${total}</strong> ${
            line.split(score + "/" + total)[1] || ""
          }</div>`;
        }
      } else if (line.trim().startsWith("Total Score:")) {
        const totalScoreParts = line.match(/Total Score:\s+(\d+)\/(\d+)/);
        if (totalScoreParts) {
          const [_, score, total] = totalScoreParts;
          return `<div class="mt-3 font-semibold">Total Score: <strong class="text-blue-700">${score}/${total}</strong></div>`;
        }
      } else if (line.trim() === "Scores:") {
        return `<h4 class="font-semibold text-gray-900 mt-3 mb-2">Scores:</h4>`;
      }
      return line;
    });

    return formattedLines.join("<br>");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Smart AI Review</h3>
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
          <div
            className="text-gray-800 prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: formatFeedbackContent(feedback),
            }}
          />
        </div>
      </div>

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
                className="bg-green-50 p-4 rounded-md border-l-4 border-green-400 shadow-sm"
              >
                <div
                  className="text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html: cleanText(item.content),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <FiAlertCircle className="text-amber-500 mr-2" />
          Areas for Improvement
        </h3>
        <div className="space-y-4">
          {improvementItems.map((item) => (
            <div
              key={item.id}
              className="bg-amber-50 p-4 rounded-md border-l-4 border-amber-400 shadow-sm"
            >
              <div
                className="text-gray-800"
                style={{
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
                dangerouslySetInnerHTML={{
                  __html: cleanText(item.content),
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
