import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { EvaluationResponse } from "../../interfaces";
import { useAppContext } from "../../Providers/AppContext";
import { backendURL, access_token } from "../../utils/constants";
import EvaluationHeader from "../../components/EvolutionResult/EvolutionHeader";
import EvaluationSummary from "../../components/EvolutionResult/EvolutionSummary";
import ExamCopiesTab from "../../components/EvolutionResult/ExamCopiesTab";
import DetailedFeedbackTab from "../../components/EvolutionResult/DetailedFeedbackTab";
import BlurSection from "../../components/EvolutionResult/BlurSection";
import { FiThumbsUp, FiThumbsDown, FiX } from "react-icons/fi";

const EvaluationResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleError, setLoading, getSessionId } = useAppContext();
  const [evaluationData, setEvaluationData] =
    useState<EvaluationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionUser, setIsSessionUser] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerClosing, setIsDrawerClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userFeedback, setUserFeedback] = useState(
    evaluationData?.user_feedback
  );

  useEffect(() => {
    let isMounted = true;

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
          setUserFeedback(response.data.user_feedback);
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

    return () => {
      isMounted = false;
    };
  }, [id]);

  const closeDrawer = () => {
    setIsDrawerClosing(true);
    setTimeout(() => {
      setIsDrawerOpen(false);
      setIsDrawerClosing(false);
    }, 300); // Match the transition duration
  };

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

  const isNewFormat = !!evaluationData.llm_response;

  const overallScore =
    isNewFormat || isSessionUser
      ? parseFloat(evaluationData.score_sum || "0")
      : (() => {
          const scoreValues = Object.values(evaluationData.scores || {});
          return scoreValues.length > 0
            ? scoreValues.reduce((sum, score) => sum + score, 0)
            : 0;
        })();

  const createdDate = new Date(evaluationData.created_at);
  const formattedDate = createdDate.toLocaleDateString();
  const formattedTime = createdDate.toLocaleTimeString();

  const submitFeedback = async (liked: boolean) => {
    if (isSubmitting || userFeedback === liked) return;

    const previousFeedback = userFeedback;
    setUserFeedback(liked);
    setIsSubmitting(true);

    try {
      const token = access_token();

      if (!token) {
        console.error("Authentication required");
        setUserFeedback(previousFeedback);
        return;
      }

      await axios.post(
        `${backendURL}/api/services/doc-feedback/`,
        {
          doc_id: evaluationData.id,
          user_feedback: liked,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setUserFeedback(previousFeedback);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <EvaluationHeader
        title={`Evaluation of ${evaluationData.doc_name}`}
        date={formattedDate}
        time={formattedTime}
        documentId={evaluationData.id}
        category={evaluationData.category}
        category_name={evaluationData.category_name}
        userFeedback={evaluationData.user_feedback}
      />
      <div className="flex gap-6">
        {/* Main Content - Left Side */}
        <div className="flex-1">
          <EvaluationSummary
            overallScore={overallScore}
            documentCount={1}
            documentType="exam copy"
            category={evaluationData.category}
            llm_response={
              isNewFormat
                ? evaluationData.llm_response
                : isSessionUser
                ? {
                    instructional_analyses: evaluationData.instruction_analyses,
                  }
                : undefined
            }
          />
          {isSessionUser ? (
            <BlurSection />
          ) : (
            <>
              <DetailedFeedbackTab
                llm_response={
                  isNewFormat ? evaluationData.llm_response : undefined
                }
                feedback={!isNewFormat ? evaluationData.feedback : undefined}
                improvements={
                  !isNewFormat ? evaluationData.improvements : undefined
                }
                strengths={!isNewFormat ? evaluationData.strengths : undefined}
                weaknesses={
                  !isNewFormat ? evaluationData.weaknesses : undefined
                }
                category={evaluationData.category}
              />
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-6">
          {/* Question Section */}
          <div className="bg-[#E8EEED] shadow-2xl rounded-2xl p-6 border border-gray-200">
            <h3 className="text-[16px] font-['Funnel_Sans'] font-semibold text-[#414651] mb-4">
              Question
            </h3>
            <div className="bg-[#FCFCFC] rounded-xl p-4 border border-gray-100">
              <p className="text-[#374151] font-['Funnel_Sans']">
                {evaluationData.question || "No question provided"}
              </p>
            </div>
          </div>

          {/* Submitted Answer Section */}
          <div className="bg-[#E8EEED] shadow-2xl rounded-2xl p-6 border border-gray-200">
            <h3 className="text-[16px] font-['Funnel_Sans'] font-semibold text-[#414651] mb-4">
              Submitted answer
            </h3>

            {/* PDF Preview - Clickable */}
            <div
              className="cursor-pointer"
              onClick={() => setIsDrawerOpen(true)}
            >
              <div className="bg-[#F9FAFB] rounded-xl p-4 border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                {evaluationData.doc_link ? (
                  <div className="aspect-[3/4] bg-white rounded-lg border border-gray-200 relative overflow-hidden">
                    <iframe
                      src={`${evaluationData.doc_link}#toolbar=0&navpanes=0&scrollbar=0&page=1&view=FitH`}
                      className="w-full h-full rounded-lg pointer-events-none"
                      title="PDF Preview"
                    />
                    <div className="absolute inset-0 bg-transparent flex items-end justify-center pb-4 opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <p className="text-xs text-white bg-black/70 px-2 py-1 rounded font-['Funnel_Sans']">
                        Click to view full document
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <p className="text-[#9CA3AF] font-['Funnel_Sans'] text-sm">
                      No document available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="bg-[#E8EEED] flex justify-between items-center shadow-2xl rounded-2xl p-6 border border-gray-200">
            <h3 className="text-[16px] font-['Funnel_Sans'] font-semibold text-[#414651]">
              Rating
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => submitFeedback(true)}
                disabled={isSubmitting}
                className={`flex items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 ${
                  userFeedback === true
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-[#F9FAFB] border border-gray-200 hover:bg-green-50 hover:border-green-200"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <FiThumbsUp
                  className={`w-4 h-4 ${
                    userFeedback === true ? "text-green-600" : "text-[#6B7280]"
                  }`}
                />
              </button>
              <button
                onClick={() => submitFeedback(false)}
                disabled={isSubmitting}
                className={`flex items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 ${
                  userFeedback === false
                    ? "bg-red-100 border-2 border-red-500"
                    : "bg-[#F9FAFB] border border-gray-200 hover:bg-red-50 hover:border-red-200"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <FiThumbsDown
                  className={`w-4 h-4 ${
                    userFeedback === false ? "text-red-600" : "text-[#6B7280]"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side Drawer for Full Document View */}
      {(isDrawerOpen || isDrawerClosing) && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
              isDrawerOpen && !isDrawerClosing ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeDrawer}
          ></div>

          {/* Drawer */}
          <div
            className={`absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
              isDrawerOpen && !isDrawerClosing
                ? "translate-x-0"
                : "translate-x-full"
            }`}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-['Grosteque'] font-semibold text-[#1F2937]">
                Document Preview
              </h2>
              <button
                onClick={closeDrawer}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FiX className="w-6 h-6 text-[#6B7280]" />
              </button>
            </div>

            <div className="p-6 h-full overflow-auto">
              <ExamCopiesTab
                docName={evaluationData.doc_name}
                docLink={evaluationData.doc_link}
                question={evaluationData.question}
                answer={
                  evaluationData.answer ||
                  (isNewFormat &&
                    evaluationData.llm_response?.FinalAssessment
                      ?.overall_feedback?.[0]) ||
                  ""
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationResultPage;
