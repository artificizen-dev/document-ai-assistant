export interface EvaluationSummaryProps {
  overallScore: number | string;
  documentCount?: number;
  documentType?: string;
  category?: string;
  llm_response?: {
    "Evaluation-P1"?: Array<{
      name: string;
      items: Array<{
        "Instruction Analyses"?: string;
        Feedback?: string;
        [key: string]: any;
      }>;
    }>;
    [key: string]: any;
  };
}
