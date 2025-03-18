import React from "react";

interface ExecutiveSummaryProps {
  summary: string;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ summary }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Executive Summary
      </h2>
      <p className="text-gray-700">{summary}</p>
    </div>
  );
};

export default ExecutiveSummary;
