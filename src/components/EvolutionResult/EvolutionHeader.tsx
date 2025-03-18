import React from "react";
import { FiDownload, FiShare2, FiPlus } from "react-icons/fi";

interface EvaluationHeaderProps {
  title: string;
  date: string;
  time: string;
}

const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({
  title,
  date,
  time,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm md:text-base text-gray-500">
          {date} {time}
        </p>
      </div>

      <div className="flex flex-wrap mt-4 md:mt-0 gap-2">
        <button className="flex items-center border border-gray-200 bg-white py-1.5 md:py-2 px-3 md:px-4 rounded-md text-xs md:text-sm text-gray-700 hover:bg-gray-50">
          <FiDownload className="mr-1 md:mr-2 w-3 h-3 md:w-4 md:h-4" /> Export
        </button>

        <button className="flex items-center border border-gray-200 bg-white py-1.5 md:py-2 px-3 md:px-4 rounded-md text-xs md:text-sm text-gray-700 hover:bg-gray-50">
          <FiShare2 className="mr-1 md:mr-2 w-3 h-3 md:w-4 md:h-4" /> Share
        </button>

        <button className="flex items-center bg-black text-white py-1.5 md:py-2 px-3 md:px-4 rounded-md text-xs md:text-sm hover:bg-gray-800">
          <FiPlus className="mr-1 md:mr-2 w-3 h-3 md:w-4 md:h-4" /> New
          Evaluation
        </button>
      </div>
    </div>
  );
};

export default EvaluationHeader;
