// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import LearnPage from './pages/LearnPage';
// // import EvaluatePage from './pages/EvaluatePage';
// import "./App.css";
// import LandingPage from "./pages/LandingPage/LandingPage";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import ROUTES from "./routes";
import LandingPage from "./pages/LandingPage/LandingPage";
import DashboardLayout from "./components/Layout/DashboardLayout/DashboardLayout";
import LearnPage from "./pages/LearnPage/LearnPage";
import EvaluatePage from "./pages/EvaluationPage/EvaluationPage";
import EvaluationResultPage from "./pages/EvalutionResultsPage/EvolutionResultPage";
import LoginPage from "./pages/Login/Login";
import SignupPage from "./pages/Signup/Signup";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.default} element={<LandingPage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.signup} element={<SignupPage />} />

        {/* Dashboard routes - wrapped with DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.learn} element={<LearnPage />} />
          <Route path={ROUTES.evaluate} element={<EvaluatePage />} />
          <Route
            path={ROUTES["evalution-summary"]}
            element={<EvaluationResultPage />}
          />
        </Route>
        <Route path={ROUTES.newChat} element={<LearnPage />}></Route>

        {/* Fallback route for undefined paths */}
        <Route path="*" element={<Navigate to={ROUTES.default} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
