import React, { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

interface EvaluationItem {
  name?: string;
  Score?: number;
  Feedback?: string;
  Strengths?: string[];
  Weaknesses?: string[];
  "Instruction Analyses"?: string;
  [key: string]: any;
}

interface EvaluationCategory {
  name: string;
  items: EvaluationItem[];
}

interface DetailedFeedbackTabProps {
  llm_response?: {
    Evaluation?: EvaluationCategory[];
    "Evaluation-P1"?: EvaluationCategory[];
    FinalAssessment?: {
      overall_feedback?: string[];
      suggested_improvements?: string[];
      overall_strengths?: string[];
    };
    [key: string]: any;
  };
  feedback?: string;
  improvements?: {
    [key: string]: any;
  };
  strengths?: {
    [key: string]: any;
  };
  weaknesses?: {
    [key: string]: any;
  };
  category?: string;
}

const DetailedFeedbackTab: React.FC<DetailedFeedbackTabProps> = ({
  llm_response,
  feedback,
  improvements,
  strengths,
  weaknesses,
  category,
}) => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  // Auto-expand the first section by default
  React.useEffect(() => {
    if (llm_response?.Evaluation && llm_response.Evaluation.length > 0) {
      setExpandedSections((prev) => ({
        ...prev,
        "eval-0": true,
      }));
    }
  }, [llm_response]);

  // Check if we're using the new format
  const isNewFormat = !!llm_response?.Evaluation;
  const isEthics = category === "Ethics";

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Get color based on score (out of 3)
  const getScoreColor = (score: number) => {
    if (score >= 2.5) return "bg-gray-100 border-gray-200";
    if (score >= 1.8) return "bg-gray-100 border-gray-200";
    if (score >= 1.2) return "bg-gray-100 border-gray-200";
    if (score >= 0.6) return "bg-gray-100 border-gray-200";
    return "bg-gray-100 border-gray-200";
  };

  if (isNewFormat) {
    return (
      <div className="space-y-8">
        {/* Show Final Assessment at the top */}
        {llm_response?.FinalAssessment && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Final Assessment
            </h3>

            {llm_response.FinalAssessment.overall_feedback && (
              <div className="bg-white p-5 rounded-lg border border-gray-200 mb-5 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">
                  Overall Feedback
                </h4>
                {llm_response.FinalAssessment.overall_feedback.map(
                  (feedback, index) => (
                    <p
                      key={`feedback-${index}`}
                      className="text-gray-700 mb-3 last:mb-0 leading-relaxed"
                    >
                      {feedback}
                    </p>
                  )
                )}
              </div>
            )}

            {llm_response.FinalAssessment.overall_strengths &&
              llm_response.FinalAssessment.overall_strengths.length > 0 && (
                <div className="bg-white p-5 rounded-lg border border-gray-200 mb-5 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">
                    Overall Strengths
                  </h4>
                  <ul className="space-y-2">
                    {llm_response.FinalAssessment.overall_strengths.map(
                      (strength, index) => (
                        <li
                          key={`strength-${index}`}
                          className="text-gray-700 pl-4 border-l-2 border-gray-300 py-1"
                        >
                          {strength}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {llm_response.FinalAssessment.suggested_improvements && (
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">
                  Suggested Improvements
                </h4>
                <ul className="space-y-2">
                  {llm_response.FinalAssessment.suggested_improvements.map(
                    (improvement, index) => (
                      <li
                        key={`improvement-${index}`}
                        className="text-gray-700 pl-4 border-l-2 border-gray-300 py-1"
                      >
                        {improvement}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        <h3 className="text-xl font-semibold my-5 text-gray-800 border-b pb-2 border-gray-200">
          Detailed Evaluation
        </h3>

        {/* Regular Evaluation sections */}
        {llm_response?.Evaluation?.map((category, categoryIndex) => (
          <div
            key={`eval-${categoryIndex}`}
            className={`rounded-lg overflow-hidden mb-5 border border-gray-200 transition-all duration-300 shadow-sm 
             ${expandedSections[`eval-${categoryIndex}`] ? "shadow-md" : ""}`}
          >
            <button
              className="w-full flex justify-between items-center p-5 
               bg-gray-50 hover:bg-gray-100 transition-all duration-300 text-left"
              onClick={() => toggleSection(`eval-${categoryIndex}`)}
            >
              <h4 className="font-semibold text-gray-900">{category.name}</h4>
              {expandedSections[`eval-${categoryIndex}`] ? (
                <FiChevronUp className="text-gray-500 transition-transform duration-300" />
              ) : (
                <FiChevronDown className="text-gray-500 transition-transform duration-300" />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out
               ${
                 expandedSections[`eval-${categoryIndex}`]
                   ? "max-h-[5000px] opacity-100"
                   : "max-h-0 opacity-0"
               }`}
            >
              <div className="p-5 border-t border-gray-200 bg-white">
                {isEthics
                  ? // For Ethics response with nested items structure
                    category.items.map((subItem, subItemIndex) => (
                      <div
                        key={`sub-item-${categoryIndex}-${subItemIndex}`}
                        className="mb-6 last:mb-0"
                      >
                        {subItem.name && (
                          <h5 className="font-medium text-gray-900 mb-3 pb-1 border-b border-gray-100">
                            {subItem.name}
                            {subItem.Score !== undefined && (
                              <span
                                className={`ml-3 px-3 py-1 rounded-full text-sm font-medium border inline-block
                               ${getScoreColor(subItem.Score)}`}
                              >
                                {subItem.Score}/3
                              </span>
                            )}
                          </h5>
                        )}

                        {subItem.Feedback && (
                          <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h6 className="font-medium text-gray-800 mb-2">
                              Feedback:
                            </h6>
                            <p className="text-gray-700 leading-relaxed">
                              {subItem.Feedback}
                            </p>
                          </div>
                        )}

                        {subItem.Strengths && subItem.Strengths.length > 0 && (
                          <div className="mb-4">
                            <h6 className="font-medium text-gray-800 mb-2 flex items-center">
                              <FiCheckCircle
                                className="text-green-500 mr-2"
                                size={16}
                              />
                              Strengths:
                            </h6>
                            <ul className="space-y-2">
                              {subItem.Strengths.map((strength, idx) => (
                                <li
                                  key={`strength-${categoryIndex}-${subItemIndex}-${idx}`}
                                  className="text-gray-700 bg-green-50 px-4 py-2 rounded-md border-l-4 border-green-400"
                                >
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {subItem.Weaknesses &&
                          subItem.Weaknesses.length > 0 && (
                            <div className="mb-4">
                              <h6 className="font-medium text-gray-800 mb-2 flex items-center">
                                <FiXCircle
                                  className="text-red-500 mr-2"
                                  size={16}
                                />
                                Weaknesses:
                              </h6>
                              <ul className="space-y-2">
                                {subItem.Weaknesses.map((weakness, idx) => (
                                  <li
                                    key={`weakness-${categoryIndex}-${subItemIndex}-${idx}`}
                                    className="text-gray-700 bg-red-50 px-4 py-2 rounded-md border-l-4 border-red-400"
                                  >
                                    {weakness}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    ))
                  : // For GS response with simple items structure
                    category.items.map((item, itemIndex) => (
                      <div
                        key={`eval-item-${categoryIndex}-${itemIndex}`}
                        className="mb-5 last:mb-0"
                      >
                        {item.Score !== undefined && (
                          <div className="flex items-center mb-3">
                            <span className="font-medium mr-2">Score:</span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border
                           ${getScoreColor(item.Score)}`}
                            >
                              {item.Score}/3
                            </span>
                          </div>
                        )}

                        {item.name && (
                          <h5 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">
                            {item.name}
                          </h5>
                        )}

                        {item.Feedback && (
                          <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="font-medium text-gray-800 mb-2">
                              Feedback:
                            </h5>
                            <p className="text-gray-700 leading-relaxed">
                              {item.Feedback}
                            </p>
                          </div>
                        )}

                        {item.Strengths && item.Strengths.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                              <FiCheckCircle
                                className="text-green-500 mr-2"
                                size={16}
                              />
                              Strengths:
                            </h5>
                            <ul className="space-y-2">
                              {item.Strengths.map((strength, idx) => (
                                <li
                                  key={`strength-${idx}`}
                                  className="text-gray-700 bg-green-50 px-4 py-2 rounded-md border-l-4 border-green-400"
                                >
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {item.Weaknesses && item.Weaknesses.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                              <FiXCircle
                                className="text-red-500 mr-2"
                                size={16}
                              />
                              Weaknesses:
                            </h5>
                            <ul className="space-y-2">
                              {item.Weaknesses.map((weakness, idx) => (
                                <li
                                  key={`weakness-${idx}`}
                                  className="text-gray-700 bg-red-50 px-4 py-2 rounded-md border-l-4 border-red-400"
                                >
                                  {weakness}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {item["Instruction Analyses"] && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h5 className="font-medium text-gray-800 mb-2">
                              Analysis:
                            </h5>
                            <p className="text-gray-700 leading-relaxed">
                              {item["Instruction Analyses"]}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
              </div>
            </div>
          </div>
        ))}

        {/* Evaluation-P1 if present and not already displayed */}
        {llm_response?.["Evaluation-P1"] && (
          <div className="mt-6">
            {llm_response["Evaluation-P1"].map((category, categoryIndex) => (
              <div
                key={`evalp1-${categoryIndex}`}
                className={`rounded-lg overflow-hidden mb-5 border border-gray-200 transition-all duration-300 shadow-sm 
                 ${
                   expandedSections[`evalp1-${categoryIndex}`]
                     ? "shadow-md"
                     : ""
                 }`}
              >
                <button
                  className="w-full flex justify-between items-center p-5 
                   bg-gray-50 hover:bg-gray-100 transition-all duration-300 text-left"
                  onClick={() => toggleSection(`evalp1-${categoryIndex}`)}
                >
                  <h4 className="font-semibold text-gray-900">
                    {category.name}
                  </h4>
                  {expandedSections[`evalp1-${categoryIndex}`] ? (
                    <FiChevronUp className="text-gray-500 transition-transform duration-300" />
                  ) : (
                    <FiChevronDown className="text-gray-500 transition-transform duration-300" />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out
                   ${
                     expandedSections[`evalp1-${categoryIndex}`]
                       ? "max-h-[2000px] opacity-100"
                       : "max-h-0 opacity-0"
                   }`}
                >
                  <div className="p-5 border-t border-gray-200 bg-white">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={`evalp1-item-${categoryIndex}-${itemIndex}`}
                        className="mb-4 last:mb-0"
                      >
                        {item.Feedback && (
                          <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="font-medium text-gray-800 mb-2">
                              Feedback:
                            </h5>
                            <p className="text-gray-700 leading-relaxed">
                              {item.Feedback}
                            </p>
                          </div>
                        )}

                        {item["Initial Scan"] && (
                          <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="font-medium text-gray-800 mb-2">
                              Initial Scan:
                            </h5>
                            <p className="text-gray-700 leading-relaxed">
                              {item["Initial Scan"]}
                            </p>
                          </div>
                        )}

                        {item["Grasp Requirements"] && (
                          <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h5 className="font-medium text-gray-800 mb-2">
                              Requirements Analysis:
                            </h5>
                            <p className="text-gray-700 leading-relaxed">
                              {item["Grasp Requirements"]}
                            </p>
                          </div>
                        )}

                        {item["Identify Key Ethical Issues"] &&
                          item["Identify Key Ethical Issues"] !==
                            "Not applicable as the question pertains to history, not ethics." && (
                            <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <h5 className="font-medium text-gray-800 mb-2">
                                Key Ethical Issues:
                              </h5>
                              <p className="text-gray-700 leading-relaxed">
                                {item["Identify Key Ethical Issues"]}
                              </p>
                            </div>
                          )}

                        {item["Instruction Analyses"] && (
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h5 className="font-medium text-gray-800 mb-2">
                              Analysis:
                            </h5>
                            <p className="text-gray-700 leading-relaxed">
                              {item["Instruction Analyses"]}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } else {
    // Original format for backward compatibility (left unchanged)
    const improvementItems =
      improvements && Object.keys(improvements).length > 0
        ? Object.entries(improvements).map(([key, value]) => ({
            id: key,
            content: value,
          }))
        : [];

    const strengthItems =
      strengths && Object.keys(strengths).length > 0
        ? Object.entries(strengths).map(([key, value]) => ({
            id: key,
            content: value,
          }))
        : [];

    const weaknessItems =
      weaknesses && Object.keys(weaknesses).length > 0
        ? Object.entries(weaknesses).map(([key, value]) => ({
            id: key,
            content: value,
          }))
        : [];

    const cleanText = (text: any) => {
      // Check if text is a string
      if (!text || typeof text !== "string") {
        // Handle object case for improvements
        if (text && typeof text === "object") {
          if ("Improvement Point" in text) {
            let result = text["Improvement Point"];

            if (text["Example"]) {
              result += `<div class="pl-4 border-l-2 border-gray-300 mt-2">
               <span class="text-sm font-medium text-gray-700">Example: </span>
               <span>${text["Example"]}</span>
             </div>`;
            }

            if (text["Link"]) {
              result += `<div class="mt-2">
               <a 
                 href="${text["Link"]}" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 class="text-blue-600 hover:text-blue-800 underline text-sm flex items-center"
               >
                 Reference Link
               </a>
             </div>`;
            }

            return result;
          }

          // Return empty string for other object types
          return "";
        }

        return "";
      }

      // Normal string processing from here
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
            return `<div class="my-2 p-2 bg-gray-50 rounded-md"><span class="font-medium">${category}:</span> <strong class="text-gray-700 px-2 py-1 bg-gray-100 rounded-full text-sm">${score}/${total}</strong> ${
              line.split(score + "/" + total)[1] || ""
            }</div>`;
          }
        } else if (line.trim().startsWith("Total Score:")) {
          const totalScoreParts = line.match(/Total Score:\s+(\d+)\/(\d+)/);
          if (totalScoreParts) {
            const [_, score, total] = totalScoreParts;
            return `<div class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200"><span class="font-semibold">Total Score:</span> <strong class="ml-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">${score}/${total}</strong></div>`;
          }
        } else if (line.trim() === "Scores:") {
          return `<h4 class="font-semibold text-gray-900 mt-4 mb-3 pb-2 border-b border-gray-200">Scores:</h4>`;
        }
        return line;
      });

      return formattedLines.join("<br>");
    };

    // Function to safely render content
    const renderContent = (content: any) => {
      const htmlContent = cleanText(content);
      return (
        <div
          className="text-gray-800 leading-relaxed"
          style={{
            overflowWrap: "break-word",
            wordWrap: "break-word",
            wordBreak: "break-word",
            hyphens: "auto",
          }}
          dangerouslySetInnerHTML={{
            __html: htmlContent,
          }}
        />
      );
    };

    return (
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Smart AI Review
          </h3>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div
              className="text-gray-800 prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: formatFeedbackContent(feedback || ""),
              }}
            />
          </div>
        </div>

        {strengthItems.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <FiCheckCircle className="text-green-500 mr-2" size={24} />
              Strengths
            </h3>
            <div className="space-y-3">
              {strengthItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg border-l-4 border-green-400 shadow-sm"
                >
                  {renderContent(item.content)}
                </div>
              ))}
            </div>
          </div>
        )}

        {weaknessItems.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <FiXCircle className="text-red-500 mr-2" size={24} />
              Weaknesses
            </h3>
            <div className="space-y-3">
              {weaknessItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg border-l-4 border-red-400 shadow-sm"
                >
                  {renderContent(item.content)}
                </div>
              ))}
            </div>
          </div>
        )}

        {improvementItems.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Areas for Improvement
            </h3>
            <div className="space-y-3">
              {improvementItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg border-l-4 border-gray-300 shadow-sm"
                >
                  {renderContent(item.content)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default DetailedFeedbackTab;
