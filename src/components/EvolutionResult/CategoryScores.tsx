import React from "react";

interface CategoryScoresProps {
  scores: {
    structure: number;
    content: number;
    clarity: number;
    accuracy: number;
  };
}

const CategoryScores: React.FC<CategoryScoresProps> = ({ scores }) => {
  const categories = [
    { name: "Structure", score: scores.structure },
    { name: "Content", score: scores.content },
    { name: "Clarity", score: scores.clarity },
    { name: "Accuracy", score: scores.accuracy },
  ];

  // Function to determine color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {categories.map((category) => (
        <div
          key={category.name}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <h3 className="text-gray-600 mb-2">{category.name}</h3>
          <p className={`text-4xl font-bold ${getScoreColor(category.score)}`}>
            {category.score}/100
          </p>
        </div>
      ))}
    </div>
  );
};

export default CategoryScores;
