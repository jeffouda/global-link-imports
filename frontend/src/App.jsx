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
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />

          <Route
            path="dashboard"
            element={
              userRole === "admin" ? (
                <DashboardPage />
              ) : (
                <Navigate to="/unauthorized" />
              )
            }
          />

          <Route
            path="new-shipment"
            element={
              userRole === "customer" ? (
                <NewShipmentPage />
              ) : (
                <Navigate to="/unauthorized" />
              )
            }
          />

          <Route
            path="tracking"
            element={
              userRole === "customer" || userRole === "driver" ? (
                <TrackingPage />
              ) : (
                <Navigate to="/unauthorized" />
              )
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
