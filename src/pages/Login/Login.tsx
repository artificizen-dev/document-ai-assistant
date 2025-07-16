import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { AuthError, LoginFormData, User } from "../../interfaces";
import { backendURL } from "../../utils/constants";
import ROUTES from "../../routes";
import axios from "axios";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAppContext } from "../../Providers/AppContext";
import { app } from "../../utils/firebase";
import background from "../../assets/login-bg.png";
import LayoutFooter from "../../components/LayoutFooter/LayoutFooter";
import logo from "../../assets/Logo.svg";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, setLoading } = useAppContext();
  const session_id = localStorage.getItem("sessionId");
  const documentId = localStorage.getItem("evaluationId");
  const isProduction = import.meta.env.VITE_Environment === "production";

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

      const accessToken = response.data.access || response.data.token || "";

      if (response.data.profile_image) {
        localStorage.setItem("profileImage", response.data.profile_image);
      }

      if (response.data.refresh) {
        localStorage.setItem("refreshToken", response.data.refresh);
      }

      login(accessToken, userData);
      if (documentId) {
        navigate(`/evaluation-summary/${documentId}`);
      } else {
        if (isProduction) {
          navigate(ROUTES.home);
        } else {
          navigate(ROUTES.default);
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        if (error.response.data.email) {
          setErrors({
            email: error.response.data.email,
          });
        } else if (error.response.data.password) {
          setErrors({
            password: error.response.data.password,
          });
        } else {
          const errorMessage =
            error.response.data.message || "Invalid email or password";
          setErrors({
            general: errorMessage,
          });
        }
      } else {
        const errorMessage =
          "An error occurred during login. Please try again.";
        setErrors({
          general: errorMessage,
        });
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

      const user = result.user;

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

      if (documentId) {
        navigate(`/evaluation-summary/${documentId}`);
      } else {
        if (isProduction) {
          navigate(ROUTES.home);
        } else {
          navigate(ROUTES.default);
        }
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      const errorMessage =
        error.message || "Google login failed. Please try again.";
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
    <div className="min-h-screen flex bg-gradient-to-r from-[#DDE5E4] to-[#e8f4f0] relative">
      <header className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex justify-center">
          <img src={logo} alt="logo" className="" />
        </div>
      </header>
      <div className="hidden lg:flex lg:flex-1 relative">
        <div
          className="absolute inset-0 bg-cover  bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="absolute inset-0"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 py-24">
          <div className="mb-8">
            <p className="text-[#6B7280] rounded-2xl border-[1px] border-[#16231B29] inline p-1 px-2 text-[12px] font-['Funnel_Sans'] tracking-wide mb-6">
              A SMART LEARNING SPACE GUIDED BY AI PROFESSORS.
            </p>
            <h1 className="text-[74px] font-['Grotesque'] font-medium text-[#204336] leading-tight">
              Learn Smarter.
              <br />
              <span className="text-[#204336]">Evaluate Faster.</span>
            </h1>
            <p className="text-[#414651] text-[16px] font-['Funnel_Sans'] mt-6 max-w-md leading-relaxed">
              A smart learning space guided by AI professors, designed for
              students to learn in their own shape, at their own pace.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 lg:px-8">
        <div className="max-w-md w-full  bg-[#FFFFFF] p-10 rounded-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-[30px] font-['Grotesque'] font-normal text-[#204336] mb-2">
              Welcome back
            </h2>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex justify-center text-[14px] items-center gap-3 py-3 px-4 border border-[#E5E7EB] rounded-xl shadow-sm text-sm font-['Funnel_Sans'] font-medium text-[#374151] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F2937] transition-all duration-200 mb-6"
          >
            <FcGoogle className="h-5 w-5" />
            Sign in with Google
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#FFFFFF] text-[#9E9F9F] text-[12px] font-['Funnel_Sans']">
                Or sign in with email
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <FiAlertCircle className="text-red-400 mr-2" />
                <p className="text-red-700 text-sm font-['Funnel_Sans']">
                  {errors.general}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-['Funnel_Sans'] font-medium text-[#374151] mb-2"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full py-3 px-4 border ${
                    errors.email ? "border-red-300" : "border-[#E5E7EB]"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F2937] focus:border-transparent bg-white font-['Funnel_Sans'] text-[#1F2937] placeholder-[#9CA3AF] transition-all duration-200`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 font-['Funnel_Sans']">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-['Funnel_Sans'] font-medium text-[#374151] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full py-3 px-4 pr-12 border ${
                    errors.password ? "border-red-300" : "border-[#E5E7EB]"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F2937] focus:border-transparent bg-white font-['Funnel_Sans'] text-[#1F2937] placeholder-[#9CA3AF] transition-all duration-200`}
                  placeholder="••••••••"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors duration-200" />
                  ) : (
                    <FiEye className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors duration-200" />
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 font-['Funnel_Sans']">
                  {errors.password}
                </p>
              )}

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  className="text-sm text-[#9CA3AF] hover:text-[#6B7280] font-['Funnel_Sans'] transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md shadow-sm text-sm font-['Funnel_Sans'] font-medium text-[#CBFB93] bg-[#204336] hover:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F2937] transition-all duration-200 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-[#6B7280] font-['Funnel_Sans']">
              Don&apos;t have an account?{" "}
              <Link
                to={ROUTES.signup}
                className="font-medium text-[#1F2937] hover:underline transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <LayoutFooter />
    </div>
  );
};

export default LoginPage;
