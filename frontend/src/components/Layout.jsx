import React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  const userRole = localStorage.getItem("role") || "customer"; // default to customer

  const getNavLinks = () => {
    const links = [
      { to: "/dashboard", label: "Dashboard" },
      { to: "#", label: "Logout", onClick: () => { localStorage.clear(); window.location.href = "/"; } }
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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border shadow-sm">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">Global Link Imports</h1>
        </div>
        <nav className="px-4 space-y-2">
          {getNavLinks().map((link, index) => (
            link.onClick ? (
              <button
                key={index}
                onClick={link.onClick}
                className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={index}
                to={link.to}
                className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-muted border-t border-border">
          <div className="py-4 px-8">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Global Link Imports. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
