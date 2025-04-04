// import React from "react";
// import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

// interface EvaluationSummaryProps {
//   overallScore: number;
//   question?: string;
//   answer?: string;
//   documentCount?: number;
//   documentType?: string;
//   strengths?: {
//     [key: string]: string;
//   };
//   improvements?: {
//     [key: string]: string;
//   };
// }

// const EvaluationSummary: React.FC<EvaluationSummaryProps> = ({
//   overallScore,
//   documentCount = 1,
//   documentType = "exam copy",
//   strengths = {},
//   improvements = {},
// }) => {
//   const strengthsList = Object.entries(strengths).map(([_, value]) => {
//     const firstSentence = value.split(".")[0] + ".";
//     return firstSentence;
//   });

//   const defaultStrengths = [
//     "The document contains well-structured information.",
//     "Several sections could benefit from more detailed explanations.",
//     "The overall quality is good with room for improvement.",
//   ];

//   const strengthsToDisplay =
//     strengthsList.length > 0 ? strengthsList : defaultStrengths;

//   const improvementsList = Object.entries(improvements).map(([_, value]) => {
//     const firstParagraph = value.split("\n\n")[0];
//     const firstSentence = firstParagraph.split(".")[0] + ".";

//     return firstSentence.replace(/\[(.*?)\]\(.*?\)/g, "$1");
//   });

//   const defaultImprovements = [
//     "Consider adding more visual elements to enhance understanding.",
//     "Expand on technical concepts with practical examples.",
//     "Review for consistency in terminology throughout.",
//   ];

//   const improvementsToDisplay =
//     improvementsList.length > 0 ? improvementsList : defaultImprovements;

//   const getScoreColors = (score: number) => {
//     if (score >= 0 && score <= 39) {
//       return {
//         lightColor: "#FFE5E5",
//         darkColor: "#FF4D4D",
//       };
//     } else if (score >= 40 && score <= 69) {
//       return {
//         lightColor: "#FFF3E0",
//         darkColor: "#FFA500",
//       };
//     } else {
//       return {
//         lightColor: "#E8F5E9",
//         darkColor: "#4CAF50",
//       };
//     }
//   };

//   const { lightColor, darkColor } = getScoreColors(overallScore);

//   const createSegments = () => {
//     const totalSegments = 20;
//     const filledSegments = Math.round((overallScore / 100) * totalSegments);
//     const segments = [];

//     const radius = 45;
//     const center = 50;
//     const segmentAngle = (2 * Math.PI) / totalSegments;
//     const segmentWidth = 8;
//     const innerRadius = radius - segmentWidth;
//     const outerRadius = radius;
//     const segmentPadding = 0.03;

//     for (let i = 0; i < totalSegments; i++) {
//       const startAngle = i * segmentAngle;
//       const endAngle = startAngle + segmentAngle - segmentPadding;

//       const startOuterX =
//         center + outerRadius * Math.cos(startAngle - Math.PI / 2);
//       const startOuterY =
//         center + outerRadius * Math.sin(startAngle - Math.PI / 2);
//       const endOuterX = center + outerRadius * Math.cos(endAngle - Math.PI / 2);
//       const endOuterY = center + outerRadius * Math.sin(endAngle - Math.PI / 2);
//       const startInnerX =
//         center + innerRadius * Math.cos(endAngle - Math.PI / 2);
//       const startInnerY =
//         center + innerRadius * Math.sin(endAngle - Math.PI / 2);
//       const endInnerX =
//         center + innerRadius * Math.cos(startAngle - Math.PI / 2);
//       const endInnerY =
//         center + innerRadius * Math.sin(startAngle - Math.PI / 2);

//       const path = [
//         `M ${startOuterX} ${startOuterY}`,
//         `A ${outerRadius} ${outerRadius} 0 0 1 ${endOuterX} ${endOuterY}`,
//         `L ${startInnerX} ${startInnerY}`,
//         `A ${innerRadius} ${innerRadius} 0 0 0 ${endInnerX} ${endInnerY}`,
//         "Z",
//       ].join(" ");

//       const color = i < filledSegments ? darkColor : lightColor;

//       segments.push(<path key={`segment-${i}`} d={path} fill={color} />);
//     }

//     return segments;
//   };

//   return (
//     <div className="bg-gray-100 rounded-lg p-6 mb-6">
//       <div className="flex flex-col md:flex-row justify-between items-center mb-4">
//         <div>
//           <h2 className="text-xl font-bold text-gray-800 mb-1">
//             Evaluation Summary
//           </h2>
//           <p className="text-gray-600 text-sm">
//             {documentCount} {documentType} evaluated
//           </p>
//         </div>
//         <div className="mt-4 md:mt-0 flex justify-center">
//           <div className="relative w-32 h-32 flex items-center justify-center">
//             <svg className="w-full h-full" viewBox="0 0 100 100">
//               {createSegments()}
//               <circle cx="50" cy="50" r="35" fill="white" />
//               {/* Score text */}
//               <text
//                 x="50"
//                 y="50"
//                 dominantBaseline="middle"
//                 textAnchor="middle"
//                 fontSize="18"
//                 fontWeight="bold"
//                 fill="#000000"
//               >
//                 {overallScore}%
//               </text>
//             </svg>
//           </div>
//         </div>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6 mt-4">
//         <div>
//           <div className="flex items-start mb-3">
//             <FiCheckCircle
//               className="text-green-500 mr-2 flex-shrink-0"
//               size={18}
//             />
//             <h3 className="font-semibold text-gray-800">Overall Strengths</h3>
//           </div>
//           <ul className="list-disc pl-8 space-y-2 text-gray-700">
//             {strengthsToDisplay.map((strength, index) => (
//               <li key={`strength-${index}`} className="break-words">
//                 {strength}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div>
//           <div className="flex items-start mb-3">
//             <FiAlertCircle
//               className="text-red-500 mr-2 flex-shrink-0"
//               size={18}
//             />
//             <h3 className="font-semibold text-gray-800">
//               Areas for Improvement
//             </h3>
//           </div>
//           <ul className="list-disc pl-8 space-y-2 text-gray-700">
//             {improvementsToDisplay.map((improvement, index) => (
//               <li key={`improvement-${index}`} className="break-words">
//                 {improvement}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EvaluationSummary;

import React from "react";
// import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

interface EvaluationSummaryProps {
  overallScore: number;
  question?: string;
  answer?: string;
  documentCount?: number;
  documentType?: string;
  strengths?: {
    [key: string]: any;
  };
  improvements?: {
    [key: string]: any;
  };
  feedback?: string;
}

const EvaluationSummary: React.FC<EvaluationSummaryProps> = ({
  overallScore,
  documentCount = 1,
  documentType = "exam copy",
  // strengths = {},
  // improvements = {},
  feedback,
}) => {
  // const extractFirstSentence = (value: any): string => {
  //   if (typeof value !== "string") {
  //     // Handle cases where value is an object (like in the improvements object)
  //     if (value && typeof value === "object" && "Improvement Point" in value) {
  //       return value["Improvement Point"];
  //     }
  //     return "";
  //   }

  //   // For string values, extract the first sentence
  //   const firstSentence = value.split(".")[0] + ".";
  //   return firstSentence;
  // };

  // const strengthsList = Object.entries(strengths)
  //   .map(([_, value]) => {
  //     return extractFirstSentence(value);
  //   })
  //   .filter(Boolean);

  // const defaultStrengths = [
  //   "The document contains well-structured information.",
  //   "Several sections could benefit from more detailed explanations.",
  //   "The overall quality is good with room for improvement.",
  // ];

  // const strengthsToDisplay =
  //   strengthsList.length > 0 ? strengthsList : defaultStrengths;

  // const improvementsList = Object.entries(improvements)
  //   .map(([_, value]) => {
  //     if (
  //       typeof value === "object" &&
  //       value !== null &&
  //       "Improvement Point" in value
  //     ) {
  //       return value["Improvement Point"];
  //     }

  //     if (typeof value !== "string") {
  //       return "";
  //     }

  //     const firstParagraph = value.split("\n\n")[0];
  //     const firstSentence = firstParagraph.split(".")[0] + ".";

  //     return firstSentence.replace(/\[(.*?)\]\(.*?\)/g, "$1");
  //   })
  //   .filter(Boolean);

  // const defaultImprovements = [
  //   "Consider adding more visual elements to enhance understanding.",
  //   "Expand on technical concepts with practical examples.",
  //   "Review for consistency in terminology throughout.",
  // ];

  // const improvementsToDisplay =
  //   improvementsList.length > 0 ? improvementsList : defaultImprovements;

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

  const { lightColor, darkColor } = getScoreColors(overallScore);

  const createSegments = () => {
    const totalSegments = 20;
    const filledSegments = Math.round((overallScore / 100) * totalSegments);
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Evaluation Summary
          </h2>
          <p className="text-gray-600 text-sm">
            {documentCount} {documentType} evaluated
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {createSegments()}
              <circle cx="50" cy="50" r="35" fill="white" />
              {/* Score text */}
              <text
                x="50"
                y="50"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="18"
                fontWeight="bold"
                fill="#000000"
              >
                {overallScore}%
              </text>
            </svg>
          </div>
        </div>
      </div>
      {feedback && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {feedback}
            </p>
          </div>
        </div>
      )}

      {/* <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div>
          <div className="flex items-start mb-3">
            <FiCheckCircle
              className="text-green-500 mr-2 flex-shrink-0"
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
              className="text-amber-500 mr-2 flex-shrink-0"
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
      </div> */}
    </div>
  );
};

export default EvaluationSummary;
