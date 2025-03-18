import React from "react";
import { FiCheck, FiX } from "react-icons/fi";

interface EvaluationSummaryProps {
  overallScore: number;
  documentCount: number;
  documentType: string;
  strengths: string[];
  areasForImprovement: string[];
}

const EvaluationSummary: React.FC<EvaluationSummaryProps> = ({
  overallScore,
  documentCount,
  documentType,
  strengths,
  areasForImprovement,
}) => {
  return (
    <div className="bg-gray-100 rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Evaluation Summary
          </h2>
          <p className="text-gray-600">
            {documentCount} {documentType} evaluated
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="text-5xl font-bold text-blue-600">
            {overallScore}/100
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div>
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
              <FiCheck className="text-green-600" size={16} />
            </div>
            <h3 className="font-semibold text-gray-800">Overall Strengths</h3>
          </div>
          <ul className="list-disc pl-8 space-y-2 text-gray-700">
            {strengths.map((strength, index) => (
              <li key={`strength-${index}`}>{strength}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-2">
              <FiX className="text-red-600" size={16} />
            </div>
            <h3 className="font-semibold text-gray-800">
              Areas for Improvement
            </h3>
          </div>
          <ul className="list-disc pl-8 space-y-2 text-gray-700">
            {areasForImprovement.map((area, index) => (
              <li key={`improvement-${index}`}>{area}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EvaluationSummary;
