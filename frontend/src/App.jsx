import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Main App component with routing
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import ShipmentListPage from './pages/ShipmentListPage';
import TrackingPage from './pages/TrackingPage';
import CreateShipmentPage from './pages/CreateShipmentPage';
import ShipmentDetailsPage from './pages/ShipmentDetailsPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tracking" element={<TrackingPage />} />

          {/* Protected Routes (Eventually) */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/shipments" element={<ShipmentListPage />} />
          <Route path="/shipments/create" element={<CreateShipmentPage />} />
          <Route path="/shipments/:id" element={<ShipmentDetailsPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Catch-all Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;