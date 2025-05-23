export interface EvaluationItem {
  name?: string;
  Score?: number;
  Feedback?: string;
  Strengths?: string[];
  Weaknesses?: string[];
  "Instruction Analyses"?: string;
  [key: string]: any;
}

export interface EvaluationCategory {
  name: string;
  items: EvaluationItem[];
}

export interface DetailedFeedbackTabProps {
  llm_response?: {
    Evaluation?: EvaluationCategory[];
    "Evaluation-P1"?: EvaluationCategory[];
    FinalAssessment?: {
      overall_feedback?: string[];
      suggested_improvements?: string[];
      overall_strengths?: string[];
    };
    [key: string]: any;
  };
  feedback?: string;
  improvements?: {
    [key: string]: any;
  };
  strengths?: {
    [key: string]: any;
  };
  weaknesses?: {
    [key: string]: any;
  };
  category?: string;
}
