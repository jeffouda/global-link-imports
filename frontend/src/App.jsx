import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Homepage from "./pages/Homepage";
import DashboardPage from "./pages/DashboardPage";
import NewShipmentPage from "./pages/NewShipmentPage";
import TrackingPage from "./pages/TrackingPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// Simple protected route component
function ProtectedRoute({ allowedRoles, userRole, children }) {
  return allowedRoles.includes(userRole) ? (
    children
  ) : (
    <Navigate to="/unauthorized" />
  );
}

function App() {
  const [userRole, setUserRole] = useState("customer"); // default role

  return (
    <Router>
      <div className="p-4 bg-gray-100">
        {/* Role selector for testing */}
        <label>
          Select Role:{" "}
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
            <option value="driver">Driver</option>
          </select>
        </label>
      </div>

      <Routes>
        <Route path="/" element={<Layout userRole={userRole} />}>
          <Route index element={<Homepage />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]} userRole={userRole}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="new-shipment"
            element={
              <ProtectedRoute allowedRoles={["customer"]} userRole={userRole}>
                <NewShipmentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="tracking"
            element={
              <ProtectedRoute
                allowedRoles={["customer", "driver"]}
                userRole={userRole}
              >
                <TrackingPage />
              </ProtectedRoute>
            }
          />

          <Route path="unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
