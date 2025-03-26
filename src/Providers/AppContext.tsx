// import React, {
//   createContext,
//   useContext,
//   useReducer,
//   useEffect,
//   useState,
// } from "react";
// import { toast } from "react-toastify";
// import {
//   ActionType,
//   AppContextType,
//   AppState,
//   initialState,
//   User,
// } from "../interfaces";

// const appReducer = (state: AppState, action: ActionType): AppState => {
//   switch (action.type) {
//     case "LOGIN":
//       return {
//         ...state,
//         user: action.payload.user,
//         isAuthenticated: true,
//         loading: false,
//       };
//     case "LOGOUT":
//       return {
//         ...state,
//         user: null,
//         isAuthenticated: false,
//         loading: false,
//       };
//     case "SET_LOADING":
//       return {
//         ...state,
//         loading: action.payload,
//       };
//     case "SET_ERROR":
//       return {
//         ...state,
//         error: action.payload,
//         loading: false,
//       };
//     case "UPDATE_USER":
//       if (!state.user) return state;
//       return {
//         ...state,
//         user: {
//           ...state.user,
//           ...(action.payload.id !== undefined ? { id: action.payload.id } : {}),
//           ...(action.payload.username !== undefined
//             ? { username: action.payload.username }
//             : {}),
//           ...(action.payload.email !== undefined
//             ? { email: action.payload.email }
//             : {}),
//           ...(action.payload.avatar !== undefined
//             ? { avatar: action.payload.avatar }
//             : {}),
//         },
//       };
//     default:
//       return state;
//   }
// };

// const AppContext = createContext<AppContextType | undefined>(undefined);

// export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [state, dispatch] = useReducer(appReducer, initialState);
//   const [refreshKey, setRefreshKey] = useState(0);

//   const triggerRefresh = () => {
//     setRefreshKey((prevKey) => prevKey + 1);
//   };

//   useEffect(() => {
//     const checkAuthStatus = () => {
//       const token = localStorage.getItem("token");
//       const storedUser = localStorage.getItem("user");
//       const isAuthenticated = localStorage.getItem("isAuthenticated");

//       if (token && storedUser && isAuthenticated === "true") {
//         try {
//           const user = JSON.parse(storedUser);
//           dispatch({ type: "LOGIN", payload: { user } });
//         } catch (error) {
//           console.error("Error parsing stored user data:", error);
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//           localStorage.removeItem("isAuthenticated");
//           localStorage.removeItem("refreshToken");
//           localStorage.removeItem("profileImage");
//         }
//       }
//     };

//     checkAuthStatus();
//   }, []);

//   const login = (token: string, userData: User) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("isAuthenticated", "true");

//     dispatch({
//       type: "LOGIN",
//       payload: { user: userData },
//     });
//   };

//   const googleLogin = async (
//     tokenData: string,
//     userData: User,
//     profileImage?: string
//   ) => {
//     localStorage.setItem("token", tokenData);
//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("isAuthenticated", "true");

//     if (profileImage) {
//       localStorage.setItem("profileImage", profileImage);
//     }

//     dispatch({
//       type: "LOGIN",
//       payload: { user: userData },
//     });
//   };

//   const updateUser = (userData: Partial<User>) => {
//     const currentUser = localStorage.getItem("user");
//     if (currentUser) {
//       const parsedUser = JSON.parse(currentUser);
//       const updatedUser = { ...parsedUser, ...userData };
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//     }

//     dispatch({ type: "UPDATE_USER", payload: userData });
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("isAuthenticated");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("profileImage");

//     dispatch({ type: "LOGOUT" });
//   };

//   const handleSuccess = (message: string) => {
//     toast.success(message, {
//       position: "top-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//     });
//   };

//   const handleError = (message: string) => {
//     toast.error(message, {
//       position: "top-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//     });

//     dispatch({ type: "SET_ERROR", payload: message });
//   };

//   const setLoading = (isLoading: boolean) => {
//     dispatch({ type: "SET_LOADING", payload: isLoading });
//   };

//   const getUserProfileImage = () => {
//     return localStorage.getItem("profileImage") || "";
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         ...state,
//         login,
//         googleLogin,
//         logout,
//         updateUser,
//         handleSuccess,
//         handleError,
//         setLoading,
//         refreshKey,
//         triggerRefresh,
//         getUserProfileImage,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useAppContext = (): AppContextType => {
//   const context = useContext(AppContext);
//   if (context === undefined) {
//     throw new Error("useAppContext must be used within an AppProvider");
//   }
//   return context;
// };

// Modify the AppContext.tsx file

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

// Helper function to generate a unique session ID
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
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [refreshKey, setRefreshKey] = useState(0);

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

    // Create and store a new session ID when the app loads
    initializeSessionId();
  }, []);

  // Function to initialize a unique session ID
  const initializeSessionId = () => {
    const newSessionId = generateSessionId();
    localStorage.setItem("sessionId", newSessionId);
    dispatch({ type: "SET_SESSION_ID", payload: newSessionId });
  };

  // Function to get the current session ID
  const getSessionId = () => {
    return state.sessionId || localStorage.getItem("sessionId") || "";
  };

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");

    dispatch({
      type: "LOGIN",
      payload: { user: userData },
    });
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
    // Do not remove sessionId during logout, as it's page-visit specific
    // Instead, we'll just generate a new one on next page load/refresh

    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
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

  return (
    <AppContext.Provider
      value={{
        ...state,
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
