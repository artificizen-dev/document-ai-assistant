import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { AuthError, LoginFormData, User } from "../../interfaces";
import { backendURL } from "../../utils/constants";
import ROUTES from "../../routes";
import axios from "axios";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAppContext } from "../../Providers/AppContext";
import { app } from "../../utils/firebase";
import { FaHome } from "react-icons/fa";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    login,
    // handleSuccess,
    // handleError,
    setLoading,
  } = useAppContext();
  const session_id = localStorage.getItem("sessionId");
  const documentId = localStorage.getItem("evaluationId");

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<AuthError>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: AuthError = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof AuthError]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoading(true);

    const requestData = {
      ...formData,
    };

    if (session_id) {
      requestData.session_id = session_id;
    }

    try {
      const response = await axios.post(
        `${backendURL}/api/users/login/`,
        requestData
      );

      const userData: User = {
        id: response.data.user?.id || response.data.id || String(Date.now()),
        username:
          response.data.user?.username ||
          response.data.username ||
          formData.email.split("@")[0],
        email:
          response.data.user?.email || response.data.email || formData.email,
        avatar:
          response.data.user?.avatar ||
          response.data.avatar ||
          response.data.profile_image ||
          "",
      };

      // Get access token
      const accessToken = response.data.access || response.data.token || "";

      // Store profile image if available
      if (response.data.profile_image) {
        localStorage.setItem("profileImage", response.data.profile_image);
      }

      // Store refresh token if available
      if (response.data.refresh) {
        localStorage.setItem("refreshToken", response.data.refresh);
      }

      // Login using the context - this will update global state and localStorage
      login(accessToken, userData);

      // handleSuccess("Login successful!");

      // Navigate to default route after successful login
      if (documentId) {
        navigate(`/evaluation-summary/${documentId}`);
      } else {
        navigate(ROUTES.default);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        if (error.response.data.email) {
          setErrors({
            email: error.response.data.email,
          });
          // handleError(error.response.data.email);
        } else if (error.response.data.password) {
          setErrors({
            password: error.response.data.password,
          });
          // handleError(error.response.data.password);
        } else {
          const errorMessage =
            error.response.data.message || "Invalid email or password";
          setErrors({
            general: errorMessage,
          });
          // handleError(errorMessage);
        }
      } else {
        const errorMessage =
          "An error occurred during login. Please try again.";
        setErrors({
          general: errorMessage,
        });
        // handleError(errorMessage);
      }
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLoading(true);

    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Get user info from Google
      const user = result.user;

      // Send user data to your backend
      const response = await axios.post(`${backendURL}/api/users/social/`, {
        email: user.email,
        username: user.displayName,
        avatar: user.photoURL,
        session_id: session_id,
      });

      console.log("Google login response:", response.data);

      const userData: User = {
        id: response.data.id || user.uid || String(Date.now()),
        email: user.email || response.data.email || "",
        username:
          user.displayName ||
          response.data.username ||
          user.email?.split("@")[0] ||
          "",
        avatar: user.photoURL || response.data.avatar || "",
      };

      const accessToken =
        response.data.access || user.refreshToken || "google-token";

      if (response.data.access) {
        localStorage.setItem("token", response.data.access);
        if (response.data.refresh) {
          localStorage.setItem("refreshToken", response.data.refresh);
        }
      }

      if (user.photoURL) {
        localStorage.setItem("profileImage", user.photoURL);
      }

      login(accessToken, userData);

      // handleSuccess("Login with Google successful!");
      if (documentId) {
        navigate(`/evaluation-summary/${documentId}`);
      } else {
        navigate(ROUTES.default);
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      const errorMessage =
        error.message || "Google login failed. Please try again.";
      // handleError(errorMessage);
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="my-0">
          <Link
            to={ROUTES.default}
            className="inline-flex items-center gap-1 text-gray-800 hover:text-black transition-colors duration-200 font-medium"
          >
            <FaHome size={18} />
            <span className="flex items-center">Home</span>
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Log in to your Document AI Assistant account
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-400 mr-2" />
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 w-full py-2 px-3 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 w-full py-2 px-3 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                placeholder="••••••••"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                ) : (
                  <FiEye className="text-gray-400 hover:text-gray-600" />
                )}
              </div>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            <FcGoogle className="h-5 w-5" />
            Google
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to={ROUTES.signup}
              className="font-medium text-black hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
