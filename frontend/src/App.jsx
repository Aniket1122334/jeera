import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import Login from "./pages/Login/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedLayout from "./components/ProtectedLayout";
import Organizations from "./pages/Organizations/Organizations";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoutes />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/organizations" element={<Organizations />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
