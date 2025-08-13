// import { Routes, Route, Navigate } from "react-router-dom";
// import "./App.css";
// import ROUTES from "./routes";
// import LandingPage from "./pages/LandingPage/LandingPage";
// import DashboardLayout from "./components/Layout/DashboardLayout/DashboardLayout";
// import LearnPage from "./pages/LearnPage/LearnPage";
// import EvaluatePage from "./pages/EvaluationPage/EvaluationPage";
// import EvaluationResultPage from "./pages/EvalutionResultsPage/EvolutionResultPage";
// import LoginPage from "./pages/Login/Login";
// import SignupPage from "./pages/Signup/Signup";
// import HomePage from "./pages/HomePage/HomePage";
// import PaymentSuccessPage from "./pages/PaymentSuccess/PaymentSuccessPage";

// function App() {
//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path={ROUTES.default} element={<LandingPage />} />
//       <Route path={ROUTES.home} element={<HomePage />} />
//       <Route path={ROUTES.login} element={<LoginPage />} />
//       <Route path={ROUTES.signup} element={<SignupPage />} />

//       {/* Dashboard routes - wrapped with DashboardLayout */}
//       <Route element={<DashboardLayout />}>
//         <Route path={ROUTES.evaluate} element={<EvaluatePage />} />
//         <Route
//           path={ROUTES["evalution-summary"]}
//           element={<EvaluationResultPage />}
//         />
//       </Route>
//       <Route path={ROUTES.newChat} element={<LearnPage />}></Route>

//       <Route path={ROUTES.paymentSuccess} element={<PaymentSuccessPage />} />

//       {/* Fallback route for undefined paths */}
//       <Route path="*" element={<Navigate to={ROUTES.default} replace />} />
//     </Routes>
//   );
// }

// export default App;

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import ROUTES from "./routes";
import LandingPage from "./pages/LandingPage/LandingPage";
import DashboardLayout from "./components/Layout/DashboardLayout/DashboardLayout";
import LearnPage from "./pages/LearnPage/LearnPage";
import EvaluatePage from "./pages/EvaluationPage/EvaluationPage";
import EvaluationResultPage from "./pages/EvalutionResultsPage/EvolutionResultPage";
import LoginPage from "./pages/Login/Login";
import SignupPage from "./pages/Signup/Signup";
import HomePage from "./pages/HomePage/HomePage";
import PaymentSuccessPage from "./pages/PaymentSuccess/PaymentSuccessPage";

function App() {
  const isProduction = import.meta.env.VITE_ENVIRONMENT === "production";
  const hostname = window.location.hostname;
  const isOracleDomain = hostname === "oracle.squirkle.xyz";
  const location = useLocation();
  console.log(import.meta.env);

  useEffect(() => {
    if (!isProduction) return;

    if (location.pathname === "/main") {
      window.location.href = "https://oracle.squirkle.xyz/";
      return;
    }
  }, [isProduction, location.pathname]);

  const getRootComponent = () => {
    if (isProduction && isOracleDomain) {
      // Oracle subdomain shows LandingPage on root
      return <LandingPage />;
    }
    // Main domain (or development) shows HomePage on root
    return <HomePage />;
  };

  const getDefaultPage = () => {
    if (isProduction && isOracleDomain) {
      return <HomePage />;
    }
    return <LandingPage />;
  };

  return (
    <Routes>
      {/* Dynamic root route based on domain */}
      <Route path={ROUTES.home} element={getRootComponent()} />

      {/* Other routes remain the same */}
      <Route path={ROUTES.default} element={getDefaultPage()} />
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.signup} element={<SignupPage />} />

      {/* Dashboard routes - wrapped with DashboardLayout */}
      <Route element={<DashboardLayout />}>
        <Route path={ROUTES.evaluate} element={<EvaluatePage />} />
        <Route
          path={ROUTES["evalution-summary"]}
          element={<EvaluationResultPage />}
        />
      </Route>
      <Route path={ROUTES.newChat} element={<LearnPage />}></Route>

      {/* Payment success page */}
      <Route path={ROUTES.paymentSuccess} element={<PaymentSuccessPage />} />

      {/* Fallback route for undefined paths */}
      <Route path="*" element={<Navigate to={ROUTES.default} replace />} />
    </Routes>
  );
}

export default App;
