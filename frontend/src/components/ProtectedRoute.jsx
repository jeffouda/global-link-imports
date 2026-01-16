import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles, userRole }) => {
  const { isLoggedIn } = useAuth();

  // Check context first, fallback to localStorage
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const isAuthenticated = isLoggedIn || (token && userData);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
