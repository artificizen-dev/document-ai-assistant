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
    <div className="flex flex-nowrap overflow-x-auto gap-4 mb-8 w-full pb-2">
      {scoreItems.map((item) => {
        return (
          <div
            key={item.name}
            className={` border border-gray-200 rounded-lg p-4 text-center flex-shrink-0 w-24 md:w-32 lg:w-40`}
          >
            <h3 className="text-gray-700 text-sm mb-1">{item.name}</h3>
            <p className={`text-4xl font-bold text-black`}>{item.score}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryScores;
