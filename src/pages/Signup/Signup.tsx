// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FiUser, FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
// import { AuthError, SignupFormData } from "../../interfaces";
// import { backendURL } from "../../utils/constants";
// import ROUTES from "../../routes";
// import axios from "axios";
// import { useAppContext } from "../../Providers/AppContext";

// const SignupPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { handleSuccess, getSessionId } = useAppContext();
//   const [formData, setFormData] = useState<SignupFormData>({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const session_id = getSessionId();
//   const [errors, setErrors] = useState<AuthError>({});
//   const [isLoading, setIsLoading] = useState(false);

//   const validateForm = (): boolean => {
//     const newErrors: AuthError = {};

//     if (!formData.username) {
//       newErrors.username = "Username is required";
//     } else if (formData.username.includes(" ")) {
//       newErrors.username = "Username cannot contain spaces";
//     } else if (formData.username.length < 3) {
//       newErrors.username = "Username must be at least 3 characters";
//     }

//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password";
//     } else if (formData.confirmPassword !== formData.password) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     if (errors[name as keyof AuthError]) {
//       setErrors({
//         ...errors,
//         [name]: undefined,
//       });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const apiData = {
//         username: formData.username,
//         email: formData.email,
//         password: formData.password,
//         confirm_password: formData.confirmPassword,
//         session_id: session_id,
//       };

//       const response = await axios.post(
//         `${backendURL}/api/users/register/`,
//         apiData
//       );

//       // Store access token
//       if (response.data.access) {
//         localStorage.setItem("token", response.data.access);
//         localStorage.setItem("refreshToken", response.data.refresh);
//         localStorage.setItem("isAuthenticated", "true");
//       }

//       // Store user object
//       if (response.data.user) {
//         localStorage.setItem("user", JSON.stringify(response.data.user));
//       }

//       // Store profile image if available
//       if (response.data.profile_image) {
//         localStorage.setItem("profileImage", response.data.profile_image);
//       }

//       // Show success message
//       handleSuccess("Account created successfully!");

//       navigate(ROUTES.default);
//     } catch (error: any) {
//       console.error("Signup error:", error);
//       if (error.response && error.response.data) {
//         if (error.response.data.email) {
//           setErrors({
//             email: error.response.data.email,
//           });
//         } else if (error.response.data.username) {
//           setErrors({
//             username: error.response.data.username,
//           });
//         } else {
//           setErrors({
//             general:
//               error.response.data.message ||
//               "Registration failed. Please try again.",
//           });
//         }
//       } else {
//         setErrors({
//           general: "An error occurred during signup. Please try again.",
//         });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">
//             Create Account
//           </h1>
//           <p className="text-gray-600">Sign up for Document AI Assistant</p>
//         </div>

//         {errors.general && (
//           <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
//             <div className="flex items-center">
//               <FiAlertCircle className="text-red-400 mr-2" />
//               <p className="text-red-700 text-sm">{errors.general}</p>
//             </div>
//           </div>
//         )}

//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <div>
//             <label
//               htmlFor="username"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Username
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiUser className="text-gray-400" />
//               </div>
//               <input
//                 id="username"
//                 name="username"
//                 type="text"
//                 autoComplete="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 className={`pl-10 w-full py-2 px-3 border ${
//                   errors.username ? "border-red-300" : "border-gray-300"
//                 } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
//                 placeholder="johndoe"
//               />
//             </div>
//             {errors.username && (
//               <p className="mt-1 text-sm text-red-600">{errors.username}</p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Email Address
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiMail className="text-gray-400" />
//               </div>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`pl-10 w-full py-2 px-3 border ${
//                   errors.email ? "border-red-300" : "border-gray-300"
//                 } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
//                 placeholder="you@example.com"
//               />
//             </div>
//             {errors.email && (
//               <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Password
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiLock className="text-gray-400" />
//               </div>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="new-password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`pl-10 w-full py-2 px-3 border ${
//                   errors.password ? "border-red-300" : "border-gray-300"
//                 } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
//                 placeholder="••••••••"
//               />
//             </div>
//             {errors.password && (
//               <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="confirmPassword"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Confirm Password
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiLock className="text-gray-400" />
//               </div>
//               <input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type="password"
//                 autoComplete="new-password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className={`pl-10 w-full py-2 px-3 border ${
//                   errors.confirmPassword ? "border-red-300" : "border-gray-300"
//                 } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
//                 placeholder="••••••••"
//               />
//             </div>
//             {errors.confirmPassword && (
//               <p className="mt-1 text-sm text-red-600">
//                 {errors.confirmPassword}
//               </p>
//             )}
//           </div>

//           <div className="flex items-center">
//             <input
//               id="terms"
//               name="terms"
//               type="checkbox"
//               required
//               className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
//             />
//             <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
//               I agree to the{" "}
//               <a href="#" className="text-black font-medium hover:underline">
//                 Terms of Service
//               </a>{" "}
//               and{" "}
//               <a href="#" className="text-black font-medium hover:underline">
//                 Privacy Policy
//               </a>
//             </label>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
//               isLoading ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//           >
//             {isLoading ? "Creating account..." : "Create account"}
//           </button>
//         </form>

//         <div className="text-center mt-4">
//           <p className="text-sm text-gray-600">
//             Already have an account?{" "}
//             <Link
//               to={ROUTES.login}
//               className="font-medium text-black hover:underline"
//             >
//               Log in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { AuthError, SignupFormData, User } from "../../interfaces";
import { backendURL } from "../../utils/constants";
import ROUTES from "../../routes";
import axios from "axios";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAppContext } from "../../Providers/AppContext";
import { app } from "../../utils/firebase";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { handleSuccess, getSessionId, login } = useAppContext();
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const session_id = getSessionId();
  const [errors, setErrors] = useState<AuthError>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: AuthError = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.includes(" ")) {
      newErrors.username = "Username cannot contain spaces";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
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

    try {
      const apiData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        session_id: session_id,
      };

      const response = await axios.post(
        `${backendURL}/api/users/register/`,
        apiData
      );

      if (response.data.access) {
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("isAuthenticated", "true");
      }

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      if (response.data.profile_image) {
        localStorage.setItem("profileImage", response.data.profile_image);
      }

      handleSuccess("Account created successfully!");

      navigate(ROUTES.default);
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.response && error.response.data) {
        if (error.response.data.email) {
          setErrors({
            email: error.response.data.email,
          });
        } else if (error.response.data.username) {
          setErrors({
            username: error.response.data.username,
          });
        } else {
          setErrors({
            general:
              error.response.data.message ||
              "Registration failed. Please try again.",
          });
        }
      } else {
        setErrors({
          general: "An error occurred during signup. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);

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

      handleSuccess("Signup with Google successful!");
      navigate(ROUTES.default);
    } catch (error: any) {
      console.error("Google signup error:", error);
      const errorMessage =
        error.message || "Google signup failed. Please try again.";
      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Sign up for Document AI Assistant</p>
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
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className={`pl-10 w-full py-2 px-3 border ${
                  errors.username ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                placeholder="johndoe"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

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
                autoComplete="new-password"
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`pl-10 w-full py-2 px-3 border ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                placeholder="••••••••"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                ) : (
                  <FiEye className="text-gray-400 hover:text-gray-600" />
                )}
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-black font-medium hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-black font-medium hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Creating account..." : "Create account"}
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
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            <FcGoogle className="text-xl" />
            Sign up with Google
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to={ROUTES.login}
                className="text-black font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
