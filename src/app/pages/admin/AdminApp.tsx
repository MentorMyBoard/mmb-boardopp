import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router";
import { auth } from "../../utils/store";
import { AdminLogin } from "./AdminLogin";
import { AdminLayout } from "./AdminLayout";
import { AdminDashboard } from "./AdminDashboard";
import { AdminDirectors } from "./AdminDirectors";
import { AdminCompanies } from "./AdminCompanies";
import { AdminAssessments } from "./AdminAssessments";
import { AdminPartners } from "./AdminPartners";
import { AdminTestimonials } from "./AdminTestimonials";
import { AdminCommunity } from "./AdminCommunity";
import { AdminContent } from "./AdminContent";

export function AdminApp() {
  const [isAuth, setIsAuth] = useState(auth.isLoggedIn());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsAuth(auth.isLoggedIn());
  }, [location.pathname]);

  const handleLogin = () => {
    setIsAuth(true);
    navigate('/admin');
  };

  const handleLogout = () => {
    auth.logout();
    setIsAuth(false);
    navigate('/admin/login');
  };

  if (!isAuth) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="directors" element={<AdminDirectors />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="assessments" element={<AdminAssessments />} />
        <Route path="partners" element={<AdminPartners />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="community" element={<AdminCommunity />} />
        <Route path="content" element={<AdminContent />} />
      </Routes>
    </AdminLayout>
  );
}
