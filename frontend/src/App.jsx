// import React, { useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   Outlet,
// } from "react-router-dom";
// import Layout from "./components/Layout";
// import HomePage from "./pages/HomePage";
// import DashboardPage from "./pages/DashboardPage";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import InventoryPage from "./pages/InventoryPage";
// import CreateShipmentPage from "./pages/CreateShipmentPage";
// import ShipmentListPage from "./pages/ShipmentListPage";
// import ShipmentDetailsPage from "./pages/ShipmentDetailsPage";
// import TrackingPage from "./pages/TrackingPage";
// import UnauthorizedPage from "./pages/UnauthorizedPage";
// import NotFoundPage from "./pages/NotFoundPage";

// // Reusable ProtectedRoute component (From Emmanuel's branch)
// // This handles the logic in one place instead of repeating it for every route.
// function ProtectedRoute({ allowedRoles, userRole, children }) {
//   if (allowedRoles.includes(userRole)) {
//     return children;
//   }
//   return <Navigate to="/unauthorized" replace />;
// }

// function App() {
//   const [userRole, setUserRole] = useState("customer"); // default role

//   return (
//     <Router>
//       {/* Quick role switcher for testing - positioned fixed */}
//       <div className="fixed top-4 right-4 card-elevated p-4 z-50">
//         <label className="block text-sm font-medium text-foreground mb-2">
//           Select Role:
//         </label>
//         <select
//           value={userRole}
//           onChange={(e) => setUserRole(e.target.value)}
//           className="block w-full px-3 py-2 border border-muted rounded-lg input-teal-focus focus:outline-none focus:ring-2"
//         >
//           <option value="admin">Admin</option>
//           <option value="customer">Customer</option>
//           <option value="driver">Driver</option>
//         </select>
//       </div>

//       <Routes>
//         {/* Auth routes outside Layout */}
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />

//         {/* passed userRole to Layout that Navbar can adapt */}
//         <Route path="/" element={<Layout userRole={userRole} />}>
//           <Route index element={<HomePage />} />

//           {/*  Using the wrapper component */}
//           <Route
//             path="dashboard"
//             element={
//               <ProtectedRoute allowedRoles={["admin"]} userRole={userRole}>
//                 <DashboardPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="new-shipment"
//             element={
//               <ProtectedRoute allowedRoles={["customer"]} userRole={userRole}>
//                 {/*<NewShipmentPage />*/}
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="tracking"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["customer", "driver"]}
//                 userRole={userRole}
//               >
//                 <TrackingPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route path="unauthorized" element={<UnauthorizedPage />} />
//           <Route path="*" element={<Navigate to="/" />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InventoryPage from "./pages/InventoryPage";
import CreateShipmentPage from "./pages/CreateShipmentPage";
import ShipmentListPage from "./pages/ShipmentListPage";
import ShipmentDetailsPage from "./pages/ShipmentDetailsPage";
import TrackingPage from "./pages/TrackingPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";

/**
 * Reusable ProtectedRoute component
 * Handles role-based access control in one place
 */
function ProtectedRoute({ allowedRoles, userRole, children }) {
  if (allowedRoles.includes(userRole)) {
    return children;
  }
  return <Navigate to="/unauthorized" replace />;
}

function App() {
  const [userRole, setUserRole] = useState("customer"); // admin | customer | driver

  return (
    <Router>
      {/* Quick role switcher (for testing/demo purposes) */}
      <div className="fixed top-4 right-4 card-elevated p-4 z-50">
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Role:
        </label>
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          className="block w-full px-3 py-2 border border-muted rounded-lg input-teal-focus focus:outline-none focus:ring-2"
        >
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
          <option value="driver">Driver</option>
        </select>
      </div>

      <Routes>
        {/* Layout wrapper */}
        <Route path="/" element={<Layout userRole={userRole} />}>
          {/* Public routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Admin routes */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]} userRole={userRole}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="inventory"
            element={
              <ProtectedRoute allowedRoles={["admin"]} userRole={userRole}>
                <InventoryPage />
              </ProtectedRoute>
            }
          />

          {/* Customer routes */}
          <Route
            path="create-shipment"
            element={
              <ProtectedRoute allowedRoles={["customer"]} userRole={userRole}>
                <CreateShipmentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="shipments"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "customer"]}
                userRole={userRole}
              >
                <ShipmentListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="shipments/:id"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "customer", "driver"]}
                userRole={userRole}
              >
                <ShipmentDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Tracking */}
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

          {/* Error pages */}
          <Route path="unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;