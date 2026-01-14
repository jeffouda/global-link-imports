import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Main App component with routing
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import InventoryPage from "./pages/InventoryPage";
import ShipmentListPage from "./pages/ShipmentListPage";
import TrackingPage from "./pages/TrackingPage";
import CreateShipmentPage from "./pages/CreateShipmentPage";
import ShipmentDetailsPage from "./pages/ShipmentDetailsPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";

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
