import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = ({ userRole }) => {
  return (
    <div className="app-container">
      <header className="header p-4 bg-white border-b border-gray-300">
        <h1 className="text-xl font-bold mb-2">Global Link Imports</h1>
        <nav className="flex gap-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          {userRole === "admin" && (
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          )}
          {userRole === "customer" && (
            <Link to="/new-shipment" className="hover:underline">
              New Shipment
            </Link>
          )}
          {(userRole === "customer" || userRole === "driver") && (
            <Link to="/tracking" className="hover:underline">
              Tracking
            </Link>
          )}
        </nav>
      </header>

      <main className="main-content p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
