import React from "react";
import { FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { EvaluationCardProps } from "../../interfaces";

const EvaluationCard: React.FC<EvaluationCardProps> = ({
  id,
  docName,
  date,
  // score = 0,
}) => {
  const navigate = useNavigate();

  // Format the date string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  const formattedDate = formatDate(date);

  return (
    <div
      className="bg-gray-100 rounded-lg p-3 mb-3 cursor-pointer hover:bg-gray-200 transition-colors"
      onClick={() => navigate(`/evaluation-summary/${id}`)}
    >
      <div className="flex items-start">
        <div className="bg-gray-200 p-2 rounded mr-3">
          <FiFileText className="text-gray-600" size={16} />
        </div>
        <div className="w-full">
          <h3 className="font-medium text-xs">Evaluation {docName}</h3>
          <div className="text-xs text-gray-500 mt-0.5">
            <span>{formattedDate}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-0.5 w-full pr-1">
            <span>1 document</span>
            {/* {score > 0 && (
              <span className="whitespace-nowrap">Avg. Grade: {score}/100</span>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationCard;
