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
  weaknesses: {
    [key: string]: string;
  };
  reference_links: string[];
  created_at: string;
  updated_at: string;
  user: number;
  user_feedback: boolean;
  score_sum: number;
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
  session_id?: string;
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
  sessionId: string | null;
  evaluations: Evaluation[];
  processingDocuments: {
    [id: string]: {
      name: string;
      startTime: number;
      status: "processing" | "completed" | "error";
      docId?: string;
    };
  };
}

export interface AppContextType extends AppState {
  register: (token: string, userData: User, profileImage?: string) => void;
  login: (token: string, userData: User) => void;
  googleLogin: (
    tokenData: string,
    userData: User,
    profileImage?: string
  ) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  handleSuccess: (message: string) => void;
  handleError: (message: string) => void;
  setLoading: (isLoading: boolean) => void;
  refreshKey: number;
  triggerRefresh: () => void;
  getUserProfileImage: () => string;
  getSessionId: () => string;
  initializeSessionId: () => void;
  startDocumentProcessing: (id: string, name: string) => void;
  completeDocumentProcessing: (id: string, docId: string) => void;
  documentProcessingError: (id: string, error: string) => void;
  fetchEvaluations: () => Promise<void>;
  isLoadingEvaluations: boolean;
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
  timestamp?: Date;
}

export interface DetailedFeedbackTabProps {
  feedback: string;
  improvements: {
    [key: string]: string;
  };
  strengths: {
    [key: string]: string;
  };
  weaknesses?: {
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

export interface Evaluation {
  id: number;
  doc_name: string;
  user: number;
  created_at: string;
}

export type ActionType =
  | { type: "LOGIN"; payload: { user: User } }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "SET_SESSION_ID"; payload: string }
  | { type: "START_DOCUMENT_PROCESSING"; payload: { id: string; name: string } }
  | {
      type: "COMPLETE_DOCUMENT_PROCESSING";
      payload: { id: string; docId: string };
    }
  | {
      type: "DOCUMENT_PROCESSING_ERROR";
      payload: { id: string; error: string };
    }
  | { type: "SET_EVALUATIONS"; payload: Evaluation[] };

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  sessionId: null,
  processingDocuments: {},
  evaluations: [],
};

export interface ChatMessageProps {
  type: MessageType;
  content: string;
  timestamp?: Date;
}

export interface SimpleCodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export interface ChatAreaProps {
  toggleReferencePanel: () => void;
  chatroomId: string | null;
}

export type MessageType = "user" | "bot";

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  sources?: string[];
}

export interface ChatThread {
  id: number;
  chatroom: number;
  ai_response: string;
  user_response: string;
  created_at: string;
}
