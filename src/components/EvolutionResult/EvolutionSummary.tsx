import React from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

interface EvaluationSummaryProps {
  overallScore: number;
  question?: string;
  answer?: string;
  documentCount?: number;
  documentType?: string;
  strengths?: {
    [key: string]: string;
  };
  improvements?: {
    [key: string]: string;
  };
}

const EvaluationSummary: React.FC<EvaluationSummaryProps> = ({
  overallScore,
  documentCount = 1,
  documentType = "exam copy",
  strengths = {},
  improvements = {},
}) => {
  // Extract strength values from object and keep them short
  const strengthsList = Object.entries(strengths).map(([_, value]) => {
    // Keep only the first sentence for summary display
    const firstSentence = value.split(".")[0] + ".";
    return firstSentence;
  });

  const defaultStrengths = [
    "The document contains well-structured information.",
    "Several sections could benefit from more detailed explanations.",
    "The overall quality is good with room for improvement.",
  ];

  const strengthsToDisplay =
    strengthsList.length > 0 ? strengthsList : defaultStrengths;

  // Process improvements to extract just the core message
  const improvementsList = Object.entries(improvements).map(([_, value]) => {
    // Get only the first sentence of the first paragraph for summary display
    const firstParagraph = value.split("\n\n")[0];
    const firstSentence = firstParagraph.split(".")[0] + ".";

    // Remove any markdown formatting or links
    return firstSentence.replace(/\[(.*?)\]\(.*?\)/g, "$1");
  });

  const defaultImprovements = [
    "Consider adding more visual elements to enhance understanding.",
    "Expand on technical concepts with practical examples.",
    "Review for consistency in terminology throughout.",
  ];

  const improvementsToDisplay =
    improvementsList.length > 0 ? improvementsList : defaultImprovements;

  return (
    <div className="bg-gray-100 rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Evaluation Summary
          </h2>
          <p className="text-gray-600 text-sm">
            {documentCount} {documentType} evaluated
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="text-6xl font-bold text-blue-600">
            {overallScore}/100
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div>
          <div className="flex items-start mb-3">
            <FiCheckCircle
              className="text-green-500 mt-1 mr-2 flex-shrink-0"
              size={18}
            />
            <h3 className="font-semibold text-gray-800">Overall Strengths</h3>
          </div>
          <ul className="list-disc pl-8 space-y-2 text-gray-700">
            {strengthsToDisplay.map((strength, index) => (
              <li key={`strength-${index}`} className="break-words">
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-start mb-3">
            <FiAlertCircle
              className="text-red-500 mt-1 mr-2 flex-shrink-0"
              size={18}
            />
            <h3 className="font-semibold text-gray-800">
              Areas for Improvement
            </h3>
          </div>
          <ul className="list-disc pl-8 space-y-2 text-gray-700">
            {improvementsToDisplay.map((improvement, index) => (
              <li key={`improvement-${index}`} className="break-words">
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EvaluationSummary;
