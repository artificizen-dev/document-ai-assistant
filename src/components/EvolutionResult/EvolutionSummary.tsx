import React from "react";
import { EvaluationSummaryProps } from "../../interfaces/evaluationSummary";

const EvaluationSummary: React.FC<EvaluationSummaryProps> = ({
  overallScore,
  documentCount = 1,
  documentType = "exam copy",
  category,
  llm_response,
}) => {
  const numericScore =
    typeof overallScore === "string" ? parseFloat(overallScore) : overallScore;

  const scorePercentage = (numericScore / 10) * 100;
  const isEthics = category === "Ethics";

  const assessmentContent = isEthics
    ? llm_response?.["Evaluation-P1"]?.[0]?.items?.[0]?.["Feedback"] ||
      llm_response?.instructional_analyses
    : llm_response?.["Evaluation-P1"]?.[0]?.items?.[0]?.[
        "Instruction Analyses"
      ] || llm_response?.instructional_analyses;

  const getScoreColors = (score: number) => {
    if (score >= 0 && score <= 39) {
      return {
        lightColor: "#E5E7EB",
        darkColor: "#EF4444",
      };
    } else if (score >= 40 && score <= 69) {
      return {
        lightColor: "#E5E7EB",
        darkColor: "#F59E0B",
      };
    } else {
      return {
        lightColor: "#E5E7EB",
        darkColor: "#10B981",
      };
    }
  };

  const { lightColor, darkColor } = getScoreColors(scorePercentage);

  return (
    <div className="bg-[#E8EEED] rounded-lg shadow-2xl p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between md:gap-5 mb-4">
        <div className="flex-1">
          <h2 className="text-[16px] font-normal text-[#414651] mb-1 font-['Funnel_Sans']">
            Evaluation Summary
          </h2>
          <p className="text-[#9E9F9F] text-[10px] font-['Funnel_Sans']">
            {documentCount} {documentType} evaluated
          </p>

          {assessmentContent && (
            <div className="mt-4">
              <div className="bg-[#F8F7F7] p-3 rounded-md border border-gray-200">
                <p className="text-[#414651] font-['Funnel_Sans'] text-[12px]">
                  {assessmentContent}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 md:mt-0 flex justify-center items-center">
          <div className="relative w-[135px] h-[135px] flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={lightColor}
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Progress arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={darkColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${
                  2 * Math.PI * 40 * (scorePercentage / 100)
                } ${2 * Math.PI * 40}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[40px] font-bold text-gray-900">
                {Math.round(numericScore)}
              </span>
              <span className="text-[10px] text-[#222222] font-medium">
                score
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationSummary;
