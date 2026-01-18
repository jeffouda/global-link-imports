import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Layout from "./components/Layout";
import SidebarLayout from "./components/SidebarLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InventoryPage from "./pages/InventoryPage";
import CreateShipmentPage from "./pages/CreateShipmentPage";
import ShipmentListPage from "./pages/ShipmentListPage";
import ShipmentDetailsPage from "./pages/ShipmentDetailsPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";

function AppContent() {
  const location = useLocation();
  const hideNavbar = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="w-full min-h-screen bg-gray-50 text-slate-800">
      {!hideNavbar && <Layout />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Other routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/inventory" element={<SidebarLayout><InventoryPage /></SidebarLayout>} />
        <Route path="/create-shipment" element={<ProtectedRoute><CreateShipmentPage /></ProtectedRoute>} />
        <Route path="/shipments" element={<SidebarLayout><ShipmentListPage /></SidebarLayout>} />
        <Route path="/shipments/:id" element={<SidebarLayout><ShipmentDetailsPage /></SidebarLayout>} />
        <Route path="/tracking" element={<ProtectedRoute><TrackOrderPage /></ProtectedRoute>} />

        {/* Error pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;