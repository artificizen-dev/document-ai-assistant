import React from "react";
import { EvaluationHeaderProps } from "../../interfaces";
import docImg from "../../assets/doc-svg.svg";

const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({
  title,
  date,
  time,
  category,
  category_name,
}) => {
  const displayTitle = title.includes("Evaluation")
    ? title
    : `Evaluation ${date}`;

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <div className="flex items-center gap-2 mb-3 md:mb-0">
          <div>
            <img src={docImg} alt="" className="h-[45px] w-[49px]" />
          </div>
          <div>
            <h1 className="text-[18px] font-['Grotesque'] md:text-[22px] font-normal text-gray-900">
              {displayTitle}
            </h1>
            <div className="flex items-center mt-1">
              <p className="text-[12px] md:text-[14px] font-['Funnel_Sans'] text-gray-500">
                {date} {time}
              </p>
              {category && (
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {category}
                </span>
              )}
              {category_name && (
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {category_name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationHeader;
