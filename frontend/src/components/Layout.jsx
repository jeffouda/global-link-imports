import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  const userRole = localStorage.getItem("role") || "customer"; // default role

  const getNavLinks = () => {
    const links = [
      { to: "/dashboard", label: "Dashboard" },
      {
        to: "#",
        label: "Logout",
        onClick: () => {
          localStorage.clear();
          window.location.href = "/";
        },
      },
    ];

    if (userRole === "admin") {
      links.splice(1, 0, { to: "/tracking", label: "Tracking" });
      links.splice(2, 0, { to: "/inventory", label: "Inventory" });
      links.splice(3, 0, { to: "/users", label: "Manage Users" });
    } else if (userRole === "driver") {
      links.splice(1, 0, { to: "/deliveries", label: "My Deliveries" });
      links.splice(2, 0, { to: "/route", label: "Route Map" });
    } else if (userRole === "customer") {
      links.splice(1, 0, { to: "/orders", label: "My Orders" });
      links.splice(2, 0, { to: "/create-shipment", label: "New Shipment" });
    }

    return links;
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">
            Global Link Imports
          </h1>
        </div>
        <nav className="px-4 space-y-2">
          {getNavLinks().map((link, index) =>
            link.onClick ? (
              <button
                key={index}
                onClick={link.onClick}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={index}
                to={link.to}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 border-t border-gray-200">
          <div className="py-4 px-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Global Link Imports. All rights
            reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
