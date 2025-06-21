import React from "react";

interface EvaluationSummaryProps {
  overallScore: number | string;
  documentCount?: number;
  documentType?: string;
  category?: string;
  llm_response?: {
    "Evaluation-P1"?: Array<{
      name: string;
      items: Array<{
        "Instruction Analyses"?: string;
        Feedback?: string;
        [key: string]: any;
      }>;
    }>;
    [key: string]: any;
  };
}

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

  // const assessmentContent = isEthics
  //   ? llm_response?.["Evaluation-P1"]?.[0]?.items?.[0]?.["Feedback"]
  //   : llm_response?.["Evaluation-P1"]?.[0]?.items?.[0]?.[
  //       "Instruction Analyses"
  //     ];

  const assessmentContent = isEthics
    ? llm_response?.["Evaluation-P1"]?.[0]?.items?.[0]?.["Feedback"] ||
      llm_response?.instructional_analyses
    : llm_response?.["Evaluation-P1"]?.[0]?.items?.[0]?.[
        "Instruction Analyses"
      ] || llm_response?.instructional_analyses;

  const getScoreColors = (score: number) => {
    if (score >= 0 && score <= 39) {
      return {
        lightColor: "#FFE5E5",
        darkColor: "#FF4D4D",
      };
    } else if (score >= 40 && score <= 69) {
      return {
        lightColor: "#FFF3E0",
        darkColor: "#FFA500",
      };
    } else {
      return {
        lightColor: "#E8F5E9",
        darkColor: "#4CAF50",
      };
    }
  };

  const { lightColor, darkColor } = getScoreColors(scorePercentage);

  const createSegments = () => {
    const totalSegments = 20;
    const filledSegments = Math.round((scorePercentage / 100) * totalSegments);
    const segments = [];

    const radius = 45;
    const center = 50;
    const segmentAngle = (2 * Math.PI) / totalSegments;
    const segmentWidth = 8;
    const innerRadius = radius - segmentWidth;
    const outerRadius = radius;
    const segmentPadding = 0.03;

    for (let i = 0; i < totalSegments; i++) {
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle - segmentPadding;

      const startOuterX =
        center + outerRadius * Math.cos(startAngle - Math.PI / 2);
      const startOuterY =
        center + outerRadius * Math.sin(startAngle - Math.PI / 2);
      const endOuterX = center + outerRadius * Math.cos(endAngle - Math.PI / 2);
      const endOuterY = center + outerRadius * Math.sin(endAngle - Math.PI / 2);
      const startInnerX =
        center + innerRadius * Math.cos(endAngle - Math.PI / 2);
      const startInnerY =
        center + innerRadius * Math.sin(endAngle - Math.PI / 2);
      const endInnerX =
        center + innerRadius * Math.cos(startAngle - Math.PI / 2);
      const endInnerY =
        center + innerRadius * Math.sin(startAngle - Math.PI / 2);

      const path = [
        `M ${startOuterX} ${startOuterY}`,
        `A ${outerRadius} ${outerRadius} 0 0 1 ${endOuterX} ${endOuterY}`,
        `L ${startInnerX} ${startInnerY}`,
        `A ${innerRadius} ${innerRadius} 0 0 0 ${endInnerX} ${endInnerY}`,
        "Z",
      ].join(" ");

      const color = i < filledSegments ? darkColor : lightColor;

      segments.push(<path key={`segment-${i}`} d={path} fill={color} />);
    }

    return segments;
  };

  return (
    <div className="bg-gray-100 rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between md:gap-5 mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Evaluation Summary
          </h2>
          <p className="text-gray-600 text-sm">
            {documentCount} {documentType} evaluated
          </p>

          {assessmentContent && (
            <div className="mt-4">
              <div className="bg-white p-3 rounded-md border border-gray-200">
                <p className="text-gray-700">{assessmentContent}</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 md:mt-0 flex justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {createSegments()}
              <circle cx="50" cy="50" r="35" fill="white" />
              <text
                x="50"
                y="50"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="18"
                fontWeight="bold"
                fill="#000000"
              >
                {numericScore}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationSummary;
