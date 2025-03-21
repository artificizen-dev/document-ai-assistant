export interface EvaluationResponse {
  id: number;
  doc_name: string;
  doc_link: string;
  question: string;
  answer: string;
  feedback: string;
  scores: {
    Content: number;
    "Language and Expression": number;
    "Analysis and Argumentation": number;
    "Structure and Organization": number;
    "Understanding of the Question": number;
    [key: string]: number;
  };
  improvements: {
    [key: string]: string;
  };
  strengths: {
    [key: string]: string;
  };
  reference_links: string[];
  created_at: string;
  updated_at: string;
  user: number;
  user_feedback: boolean;
}

export interface CategoryScoresProps {
  scores: {
    [key: string]: number;
  };
}

export interface EvaluationSummaryProps {
  overallScore: number;
  answer: string;
  question: string;
}

export interface ExecutiveSummaryProps {
  feedback: string;
  improvements: {
    [key: string]: string;
  };
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthError {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AppContextType extends AppState {
  login: (token: string, userData: User) => void;
  logout: () => void;
  handleSuccess: (message: string) => void;
  handleError: (message: string) => void;
  setLoading: (isLoading: boolean) => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

export interface EvaluationCardProps {
  id: number;
  docName: string;
  date: string;
  score?: number;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EvaluationListItem {
  id: number;
  doc_name: string;
  user: number;
  created_at: string;
  score?: number;
}

export interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  files: File[];
}

export interface SelectedFile {
  file: File;
  id: string;
}

export interface DetailedFeedbackTabProps {
  feedback: string;
  improvements: {
    [key: string]: string;
  };
  strengths: {
    [key: string]: string;
  };
}

export interface EvaluationHeaderProps {
  title: string;
  date: string;
  time: string;
  onNewEvaluation?: () => void;
  documentId?: number;
  userFeedback?: boolean | null;
}

export type ActionType =
  | { type: "LOGIN"; payload: { user: User } }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

export const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};
