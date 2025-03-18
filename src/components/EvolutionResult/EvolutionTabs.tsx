import React, { useState } from "react";

interface EvaluationTabsProps {
  children: React.ReactNode;
}

export const EvaluationTabs: React.FC<EvaluationTabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState("summary");

  const tabs = [
    { id: "exam-copies", label: "Exam Copies" },
    { id: "summary", label: "Summary" },
    { id: "detailed-analysis", label: "Detailed Analysis" },
    { id: "recommendations", label: "Recommendations" },
    { id: "documents", label: "Documents" },
  ];

  return (
    <div>
      <div className="flex overflow-x-auto mb-6 bg-gray-100 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-5 py-3 whitespace-nowrap font-medium text-sm transition-colors duration-200 
              ${
                activeTab === tab.id
                  ? "bg-white text-black"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default EvaluationTabs;
