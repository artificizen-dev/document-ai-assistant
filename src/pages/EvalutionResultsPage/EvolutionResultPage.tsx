import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { EvaluationResponse } from "../../interfaces";
import { useAppContext } from "../../Providers/AppContext";
import { backendURL, access_token } from "../../utils/constants";
import EvaluationHeader from "../../components/EvolutionResult/EvolutionHeader";
import EvaluationSummary from "../../components/EvolutionResult/EvolutionSummary";
import CategoryScores from "../../components/EvolutionResult/CategoryScores";
import EvaluationTabs from "../../components/EvolutionResult/EvolutionTabs";
import ExamCopiesTab from "../../components/EvolutionResult/ExamCopiesTab";
import DetailedFeedbackTab from "../../components/EvolutionResult/DetailedFeedbackTab";
import RecommendationsTab from "../../components/EvolutionResult/RecommendationsTab";
import BlurSection from "../../components/EvolutionResult/BlurSection";

const EvaluationResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleError, setLoading, getSessionId } = useAppContext();
  const [activeTab, setActiveTab] = useState("exam-copies");
  const [evaluationData, setEvaluationData] =
    useState<EvaluationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionUser, setIsSessionUser] = useState(false);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const fetchEvaluation = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setIsLoading(true);
        }

        const token = access_token();
        const sessionId = getSessionId();
        const evaluationId = id || localStorage.getItem("evaluationId");

        if (!evaluationId) {
          if (isMounted) {
            handleError("Evaluation ID not found");
          }
          return;
        }

        let url = `${backendURL}/api/services/docs/${evaluationId}/`;
        let headers: Record<string, string> = {};
        let isUsingSession = false;

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        } else if (sessionId) {
          url += `?session_id=${sessionId}`;
          isUsingSession = true;
        } else {
          if (isMounted) {
            handleError("Authentication required");
            navigate("/login");
          }
          return;
        }

        const response = await axios.get(url, { headers });

        if (isMounted) {
          setEvaluationData(response.data);
          setIsSessionUser(isUsingSession);
          console.log(response.data);
        }
      } catch (error: any) {
        if (isMounted) {
          console.error("Error fetching evaluation:", error);
          handleError(
            error.response?.data?.message || "Failed to fetch evaluation data"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsLoading(false);
        }
      }
    };

    fetchEvaluation();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [id]); // Removed dependencies that could cause infinite loops

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!evaluationData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Evaluation not found
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the evaluation you're looking for. Please try again.
        </p>
        <button
          onClick={() => navigate("/evaluate")}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Return to Evaluation Page
        </button>
      </div>
    );
  }

  const scoreValues = Object.values(evaluationData.scores || {});
  const overallScore =
    scoreValues.length > 0
      ? scoreValues.reduce((sum, score) => sum + score, 0)
      : evaluationData.score_sum || 0;

  const createdDate = new Date(evaluationData.created_at);
  const formattedDate = createdDate.toLocaleDateString();
  const formattedTime = createdDate.toLocaleTimeString();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header is always visible */}
      <EvaluationHeader
        title={`Evaluation of ${evaluationData.doc_name}`}
        date={formattedDate}
        time={formattedTime}
        documentId={evaluationData.id}
        userFeedback={evaluationData.user_feedback}
      />

      {/* Summary is always visible */}
      <EvaluationSummary
        overallScore={overallScore}
        documentCount={1}
        documentType="exam copy"
        question={evaluationData.question}
        answer={evaluationData.answer}
        strengths={evaluationData.strengths}
        improvements={evaluationData.improvements}
      />

      {/* For session users, show everything below as blurred with signup prompt */}
      {isSessionUser ? (
        <BlurSection />
      ) : (
        <>
          {/* Full content for authenticated users */}
          <CategoryScores scores={evaluationData.scores} />

          <EvaluationTabs activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === "exam-copies" && (
              <ExamCopiesTab
                docName={evaluationData.doc_name}
                docLink={evaluationData.doc_link}
                question={evaluationData.question}
                answer={evaluationData.answer}
              />
            )}

            {activeTab === "detailed-feedback" && (
              <DetailedFeedbackTab
                feedback={evaluationData.feedback}
                improvements={evaluationData.improvements}
                strengths={evaluationData.strengths}
              />
            )}

            {activeTab === "recommendations" && (
              <RecommendationsTab
                referenceLinks={evaluationData.reference_links}
              />
            )}
          </EvaluationTabs>
        </>
      )}
    </div>
  );
};

export default EvaluationResultPage;
