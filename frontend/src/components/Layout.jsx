import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = ({ userRole }) => {
  return (
    <div className="app-container">
      <header className="header">
        <h1>Global Link Imports</h1>
        <nav className="nav">
          <Link to="/">Home</Link>

          {/* Dashboard is only for admin */}
          {userRole === "admin" && <Link to="/dashboard">Dashboard</Link>}

          {/* New Shipment only for customers */}
          {userRole === "customer" && (
            <Link to="/new-shipment">New Shipment</Link>
          )}

          {/* Tracking available for both customers and drivers */}
          {(userRole === "customer" || userRole === "driver") && (
            <Link to="/tracking">Tracking</Link>
          )}
        </nav>
      </header>

      <main className="main">
        <Outlet /> {/* Renders the child route page */}
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Global Link Imports</p>
      </footer>
    </div>
  );
};

export default Layout;
