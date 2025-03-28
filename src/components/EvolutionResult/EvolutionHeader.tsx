import React, { useState } from "react";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { HiThumbUp, HiThumbDown } from "react-icons/hi";
import { EvaluationHeaderProps } from "../../interfaces";
import axios from "axios";
import { backendURL, access_token } from "../../utils/constants";

const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({
  title,
  date,
  time,
  documentId,
  userFeedback: initialUserFeedback,
}) => {
  // Local state to manage feedback without page reload
  const [userFeedback, setUserFeedback] = useState(initialUserFeedback);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayTitle = title.includes("Evaluation")
    ? title
    : `Evaluation ${date}`;

  const submitFeedback = async (liked: boolean) => {
    if (isSubmitting || userFeedback === liked) return;

    setUserFeedback(liked);

    setIsSubmitting(true);

    try {
      const token = access_token();

      if (!token) {
        console.error("Authentication required");
        setUserFeedback(initialUserFeedback);
        return;
      }

      await axios.post(
        `${backendURL}/api/services/doc-feedback/`,
        {
          doc_id: documentId,
          user_feedback: liked,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Feedback submitted successfully");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setUserFeedback(initialUserFeedback);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderThumbsUp = () => {
    if (userFeedback === true) {
      return <HiThumbUp className="mr-1.5" size={14} />;
    }
    return <FiThumbsUp className="mr-1.5" size={14} />;
  };

  const renderThumbsDown = () => {
    if (userFeedback === false) {
      return <HiThumbDown className="mr-1.5" size={14} />;
    }
    return <FiThumbsDown className="mr-1.5" size={14} />;
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <div className="mb-3 md:mb-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {displayTitle}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            {date} {time}
          </p>
        </div>

        <div className="flex md:hidden w-full space-x-2 mb-3">
          <button
            onClick={() => submitFeedback(true)}
            disabled={isSubmitting}
            className={`flex items-center justify-center border border-gray-200 bg-white py-1.5 px-3 rounded-md text-xs ${
              userFeedback === true
                ? "text-blue-600 border-blue-200 bg-blue-50"
                : "text-gray-700 hover:bg-gray-50"
            } disabled:opacity-50 w-1/2`}
            aria-label="Like evaluation"
          >
            {renderThumbsUp()} Like
          </button>
          <button
            onClick={() => submitFeedback(false)}
            disabled={isSubmitting}
            className={`flex items-center justify-center border border-gray-200 bg-white py-1.5 px-3 rounded-md text-xs ${
              userFeedback === false
                ? "text-red-600 border-red-200 bg-red-50"
                : "text-gray-700 hover:bg-gray-50"
            } disabled:opacity-50 w-1/2`}
            aria-label="Dislike evaluation"
          >
            {renderThumbsDown()} Dislike
          </button>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="hidden md:flex space-x-2">
            <button
              onClick={() => submitFeedback(true)}
              disabled={isSubmitting}
              className={`flex items-center border border-gray-200 bg-white py-1.5 px-3 rounded-md text-xs ${
                userFeedback === true
                  ? "text-blue-600 border-blue-200 bg-blue-50"
                  : "text-gray-700 hover:bg-gray-50"
              } disabled:opacity-50`}
              aria-label="Like evaluation"
            >
              {renderThumbsUp()}
            </button>
            <button
              onClick={() => submitFeedback(false)}
              disabled={isSubmitting}
              className={`flex items-center border border-gray-200 bg-white py-1.5 px-3 rounded-md text-xs ${
                userFeedback === false
                  ? "text-red-600 border-red-200 bg-red-50"
                  : "text-gray-700 hover:bg-gray-50"
              } disabled:opacity-50`}
              aria-label="Dislike evaluation"
            >
              {renderThumbsDown()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationHeader;
