import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import {
  ActionType,
  AppContextType,
  AppState,
  initialState,
  User,
} from "../interfaces";
import { access_token, backendURL } from "../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const generateSessionId = (): string => {
  const timestamp = new Date().getTime();
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `session_${timestamp}_${randomStr}`;
};

const appReducer = (state: AppState, action: ActionType): AppState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        evaluations: [],
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "UPDATE_USER":
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          ...(action.payload.id !== undefined ? { id: action.payload.id } : {}),
          ...(action.payload.username !== undefined
            ? { username: action.payload.username }
            : {}),
          ...(action.payload.email !== undefined
            ? { email: action.payload.email }
            : {}),
          ...(action.payload.avatar !== undefined
            ? { avatar: action.payload.avatar }
            : {}),
        },
      };
    case "SET_SESSION_ID":
      return {
        ...state,
        sessionId: action.payload,
      };

    case "SET_EVALUATIONS":
      return {
        ...state,
        evaluations: action.payload,
      };

    case "START_DOCUMENT_PROCESSING":
      return {
        ...state,
        processingDocuments: {
          ...state.processingDocuments,
          [action.payload.id]: {
            name: action.payload.name,
            startTime: Date.now(),
            status: "processing",
          },
        },
      };
    case "COMPLETE_DOCUMENT_PROCESSING":
      return {
        ...state,
        processingDocuments: {
          ...state.processingDocuments,
          [action.payload.id]: {
            ...state.processingDocuments[action.payload.id],
            status: "completed",
            docId: action.payload.docId,
          },
        },
      };
    case "DOCUMENT_PROCESSING_ERROR":
      return {
        ...state,
        processingDocuments: {
          ...state.processingDocuments,
          [action.payload.id]: {
            ...state.processingDocuments[action.payload.id],
            status: "error",
          },
        },
      };
    case "SET_CHATROOMS":
      return {
        ...state,
        chatrooms: action.payload,
      };

    case "ADD_CHATROOM":
      return {
        ...state,
        chatrooms: [action.payload, ...state.chatrooms],
      };

    case "SET_CURRENT_CHATROOM":
      return {
        ...state,
        currentChatroomId: action.payload || null,
      };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(false);
  const [isLoadingChatrooms, setIsLoadingChatrooms] = useState(false);

  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const isAuthenticated = localStorage.getItem("isAuthenticated");

      if (token && storedUser && isAuthenticated === "true") {
        try {
          const user = JSON.parse(storedUser);
          dispatch({ type: "LOGIN", payload: { user } });
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("profileImage");
        }
      }
    };

    checkAuthStatus();
    initializeSessionId();
  }, []);

  const fetchEvaluations = async () => {
    try {
      setIsLoadingEvaluations(true);
      const token = access_token();
      if (!token) {
        return;
      }
      const response = await axios.get(`${backendURL}/api/services/docs/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: "SET_EVALUATIONS", payload: response.data });
    } catch (error) {
      console.error("Failed to fetch evaluations:", error);
      handleError("Failed to fetch documents. Please try again.");
    } finally {
      setIsLoadingEvaluations(false);
    }
  };

  const fetchChatrooms = async () => {
    const token = access_token();
    if (!token || !state.user) return;

    setIsLoadingChatrooms(true);
    try {
      const response = await axios.get(`${backendURL}/api/chat/chatroom/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: "SET_CHATROOMS", payload: response.data });
      if (!response.data || response.data.length === 0) {
        dispatch({ type: "SET_CURRENT_CHATROOM", payload: "" });
      }
    } catch (error) {
      console.error("Failed to fetch chatrooms:", error);
      handleError("Failed to fetch chat history. Please try again.");
    } finally {
      setIsLoadingChatrooms(false);
    }
  };

  const createChatroom = async (): Promise<string | null> => {
    const token = access_token();
    if (!token || !state.user) return null;

    try {
      const response = await axios.post(
        `${backendURL}/api/chat/chatroom/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newChatroom = response.data;
      dispatch({ type: "ADD_CHATROOM", payload: newChatroom });
      setTimeout(() => {
        dispatch({ type: "SET_CURRENT_CHATROOM", payload: newChatroom.id });
      }, 1000);

      const searchParams = new URLSearchParams(location.search);
      searchParams.set("chatroom_id", newChatroom.id);
      navigate(`${location.pathname}?${searchParams.toString()}`, {
        replace: true,
      });

      return newChatroom.id;
    } catch (error) {
      console.error("Failed to create chatroom:", error);
      handleError("Failed to create a new chat. Please try again.");
      return null;
    }
  };

  const selectChatroom = (chatroomId: string) => {
    dispatch({ type: "SET_CURRENT_CHATROOM", payload: chatroomId });
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("chatroom_id", chatroomId);
    window.history.replaceState({}, "", currentUrl.toString());
  };

  const initializeSessionId = () => {
    const newSessionId = generateSessionId();
    localStorage.setItem("sessionId", newSessionId);
    dispatch({ type: "SET_SESSION_ID", payload: newSessionId });
  };

  const getSessionId = () => {
    return state.sessionId || localStorage.getItem("sessionId") || "";
  };

  const register = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");

    dispatch({
      type: "LOGIN",
      payload: { user: userData },
    });

    fetchEvaluations();
  };

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");

    dispatch({
      type: "LOGIN",
      payload: { user: userData },
    });

    fetchEvaluations();
  };

  const googleLogin = async (
    tokenData: string,
    userData: User,
    profileImage?: string
  ) => {
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");

    if (profileImage) {
      localStorage.setItem("profileImage", profileImage);
    }

    dispatch({
      type: "LOGIN",
      payload: { user: userData },
    });

    fetchEvaluations();
  };

  const updateUser = (userData: Partial<User>) => {
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser);
      const updatedUser = { ...parsedUser, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    dispatch({ type: "UPDATE_USER", payload: userData });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("evaluationId");

    dispatch({ type: "LOGOUT" });
  };

  const handleSuccess = (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleError = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    dispatch({ type: "SET_ERROR", payload: message });
  };

  const setLoading = (isLoading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: isLoading });
  };

  const getUserProfileImage = () => {
    return localStorage.getItem("profileImage") || "";
  };

  const startDocumentProcessing = (id: string, name: string) => {
    dispatch({ type: "START_DOCUMENT_PROCESSING", payload: { id, name } });
  };

  const completeDocumentProcessing = (id: string, docId: string) => {
    dispatch({ type: "COMPLETE_DOCUMENT_PROCESSING", payload: { id, docId } });
  };

  const documentProcessingError = (id: string, error: string) => {
    dispatch({ type: "DOCUMENT_PROCESSING_ERROR", payload: { id, error } });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        register,
        login,
        googleLogin,
        logout,
        updateUser,
        handleSuccess,
        handleError,
        setLoading,
        refreshKey,
        triggerRefresh,
        getUserProfileImage,
        getSessionId,
        initializeSessionId,
        startDocumentProcessing,
        completeDocumentProcessing,
        documentProcessingError,
        fetchEvaluations,
        isLoadingEvaluations,
        // Chatroom related functions
        fetchChatrooms,
        createChatroom,
        selectChatroom,
        isLoadingChatrooms,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
