export interface EvaluationResult {
  id: string;
  date: string;
  time: string;
  overallScore: number;
  documentCount: number;
  documentType: string;
  strengths: string[];
  areasForImprovement: string[];
  categoryScores: {
    structure: number;
    content: number;
    clarity: number;
    accuracy: number;
  };
  executiveSummary: string;
}
