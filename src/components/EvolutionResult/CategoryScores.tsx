import React from "react";
import { CategoryScoresProps } from "../../interfaces";

const CategoryScores: React.FC<CategoryScoresProps> = ({ scores }) => {
  const scoreItems = [
    {
      name: "Structure",
      score: scores["Structure"] || scores["Structure and Organization"] || 0,
    },
    { name: "Content", score: scores["Content"] || 0 },
    {
      name: "Clarity",
      score: scores["Clarity"] || scores["Language and Expression"] || 0,
    },
    {
      name: "Accuracy",
      score: scores["Accuracy"] || scores["Analysis and Argumentation"] || 0,
    },
    {
      name: "Understanding",
      score:
        scores["Understanding"] || scores["Understanding of the Question"] || 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {scoreItems.map((item) => (
        <div
          key={item.name}
          className="bg-white border border-gray-200 rounded-lg p-4 text-center"
        >
          <h3 className="text-gray-500 text-sm mb-1">{item.name}</h3>
          <p className="text-4xl font-bold text-gray-900">{item.score}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryScores;
