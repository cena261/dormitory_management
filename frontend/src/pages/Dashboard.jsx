import { useEffect } from "react";
import ManagerLayout from "../components/Layout/ManagerLayout.jsx";
import DashboardContent from "../components/DashboardContent.jsx";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      logout();
      navigate("/login");
    }
  }, [isAdmin, logout, navigate]);

  return (
    <ManagerLayout>
      {/* Nội dung trang Dashboard */}
      <DashboardContent />
    </ManagerLayout>
  );
}

export default Dashboard;
