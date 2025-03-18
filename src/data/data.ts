import { EvaluationResult } from "../interfaces";

export const sampleEvaluationData: EvaluationResult = {
  id: "eval-2025-03-11",
  date: "11/03/2025",
  time: "09:11:46",
  overallScore: 74,
  documentCount: 1,
  documentType: "exam copy",
  strengths: [
    "The document contains well-structured information.",
    "Several sections could benefit from more detailed explanations.",
    "The overall quality is good with room for improvement.",
  ],
  areasForImprovement: [
    "Consider adding more visual elements to enhance understanding.",
    "Expand on technical concepts with practical examples.",
    "Review for consistency in terminology throughout.",
  ],
  categoryScores: {
    structure: 2,
    content: 81,
    clarity: 51,
    accuracy: 82,
  },
  executiveSummary:
    "This is an automated evaluation of the uploaded documents.",
};

export default sampleEvaluationData;
