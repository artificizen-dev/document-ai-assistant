import React from "react";

interface EvaluationTabsProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const EvaluationTabs: React.FC<EvaluationTabsProps> = ({
  children,
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: "exam-copies", label: "Exam Copies" },
    { id: "detailed-feedback", label: "Detailed Feedback" },
    { id: "recommendations", label: "Recommendations" },
  ];

  return (
    <div className="mt-8">
      <div className="flex overflow-x-auto mb-6 bg-gray-100 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-5 py-3 whitespace-nowrap font-medium text-sm transition-colors duration-200 
              ${
                activeTab === tab.id
                  ? "bg-white text-black border-b-2 border-black"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
};

export default EvaluationTabs;
