import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./components/Layout";
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Other routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/inventory" element={<Layout><InventoryPage /></Layout>} />
        <Route path="/create-shipment" element={<ProtectedRoute><CreateShipmentPage /></ProtectedRoute>} />
        <Route path="/shipments" element={<Layout><ShipmentListPage /></Layout>} />
        <Route path="/shipments/:id" element={<Layout><ShipmentDetailsPage /></Layout>} />
        <Route path="/tracking" element={<ProtectedRoute><TrackOrderPage /></ProtectedRoute>} />

        {/* Error pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;