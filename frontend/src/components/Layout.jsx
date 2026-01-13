import React from "react";
import { Link, Outlet } from "react-router-dom";
import { NAV_LINKS } from "../routes/navLinks";

const Layout = ({ userRole }) => {
  return (
    <div className="app-container">
      <header className="header">
        <h1>Global Link Imports</h1>

        <nav className="nav">
          {NAV_LINKS.filter((link) => link.roles.includes(userRole)).map(
            (link) => (
              <Link key={link.path} to={link.path}>
                {link.label}
              </Link>
            )
          )}
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Global Link Imports</p>
      </footer>
    </div>
  );
};

export default Layout;
