import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// Placeholder components (We will create these files next)
const Login = () => <h1>Login Page (Squad 1)</h1>;
const Dashboard = () => <h1>Dashboard (Squad 2)</h1>;
const NotFound = () => <h1>404 - Page Not Found</h1>;

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes (Eventually) */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;