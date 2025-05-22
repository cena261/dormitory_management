import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import StudentManager from "./pages/StudentManager";
import RoomManager from "./pages/RoomManager";
import InvoiceManager from "./pages/InvoiceManager";
import NotificationManager from "./pages/NotificationManager";
import ContractManager from "./pages/ContractManager";
import RequestManager from "./pages/RequestManager";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
//Student import
import BillPayment from "./pages/sv_pages/Bill";
import PaymentConfirmation from "./pages/sv_pages/Pay-confirm";
import PersonalInfo from "./pages/sv_pages/PersonalInfo";
import Layout from "@/components/Layout/layout";
import RoomInfo from "./pages/sv_pages/RoomInfo";
import Report from "./pages/sv_pages/Report";
import EmergencySupport from "./pages/sv_pages/EmergencySupport";
import Rules from "./pages/sv_pages/Rules";
import Notification from "./pages/sv_pages/Notification";

// Protected Route component cho quản trị viên
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== "QuanTriVien") {
    return <Navigate to="/login" />;
  }

  return children;
};

// Protected Route component cho sinh viên
const StudentProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== "SinhVien") {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route
            path="/dashboard"
            element={
              <AdminProtectedRoute>
                <Dashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/student-manager"
            element={
              <AdminProtectedRoute>
                <StudentManager />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/room-manager"
            element={
              <AdminProtectedRoute>
                <RoomManager />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/invoice-manager"
            element={
              <AdminProtectedRoute>
                <InvoiceManager />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/notification-manager"
            element={
              <AdminProtectedRoute>
                <NotificationManager />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/contract-manager"
            element={
              <AdminProtectedRoute>
                <ContractManager />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/request-manager"
            element={
              <AdminProtectedRoute>
                <RequestManager />
              </AdminProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/bill"
            element={
              <StudentProtectedRoute>
                <Layout>
                  <BillPayment />
                </Layout>
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/payment-confirmation"
            element={
              <StudentProtectedRoute>
                <Layout>
                  <PaymentConfirmation />
                </Layout>
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/personal-info"
            element={
              <StudentProtectedRoute>
                <Layout>
                  <PersonalInfo />
                </Layout>
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/room-info"
            element={
              <StudentProtectedRoute>
                <Layout>
                  <RoomInfo />
                </Layout>
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <StudentProtectedRoute>
                <Layout>
                  <Report />
                </Layout>
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/emergency-support"
            element={
              <StudentProtectedRoute>
                <Layout>
                  <EmergencySupport />
                </Layout>
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/rules"
            element={
              <StudentProtectedRoute>
                <Layout>
                  <Rules />
                </Layout>
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <StudentProtectedRoute>
                <Layout>
                  <Notification />
                </Layout>
              </StudentProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
