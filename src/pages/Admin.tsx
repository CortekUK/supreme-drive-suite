import { useState, useEffect } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboardPage from "./AdminDashboard";
import AdminJobs from "./AdminJobs";
import AdminDrivers from "./AdminDrivers";
import AdminVehicles from "./AdminVehicles";
import AdminReports from "./AdminReports";
import AdminPricing from "./AdminPricing";
import AdminTestimonials from "./AdminTestimonials";
import AdminSettings from "./AdminSettings";
import JobDetail from "./admin/JobDetail";

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AdminLayout user={user}>
      <Routes>
        <Route path="/" element={<AdminDashboardPage />} />
        <Route path="/jobs" element={<AdminJobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/drivers" element={<AdminDrivers />} />
        <Route path="/vehicles" element={<AdminVehicles />} />
        <Route path="/reports" element={<AdminReports />} />
        <Route path="/pricing" element={<AdminPricing />} />
        <Route path="/testimonials" element={<AdminTestimonials />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;
