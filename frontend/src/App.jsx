import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Layout from "./components/Layout";
import Homepage from "./pages/Homepage";
import DashboardPage from "./pages/DashboardPage";
import NewShipmentPage from "./pages/NewShipmentPage";
import TrackingPage from "./pages/TrackingPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// Reusable ProtectedRoute component (From Emmanuel's branch)
// This handles the logic in one place instead of repeating it for every route.
function ProtectedRoute({ allowedRoles, userRole, children }) {
  if (allowedRoles.includes(userRole)) {
    return children;
  }
  return <Navigate to="/unauthorized" replace />;
}

function App() {
  const [userRole, setUserRole] = useState("customer"); // default role

  return (
    <Router>
      <div style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
        {/* Quick role switcher for testing */}
        <label>
          Select Role:{" "}
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
            <option value="driver">Driver</option>
          </select>
        </label>
      </div>

      <Routes>
        {/* passed userRole to Layout that Navbar can adapt */}
        <Route path="/" element={<Layout userRole={userRole} />}>
          <Route index element={<Homepage />} />

          {/*  Using the wrapper component */}
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
