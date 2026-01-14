import React from "react";
import { Link, Outlet } from "react-router-dom";

import { NAV_LINKS } from "../routes/navLink";

const Layout = ({ userRole }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">Global Link Imports</h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              {NAV_LINKS.filter((link) => link.roles.includes(userRole)).map(
                (link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="nav-link text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-foreground hover:text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border">
          <nav className="px-4 py-2 space-y-1">
            {NAV_LINKS.filter((link) => link.roles.includes(userRole)).map(
              (link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t border-border">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Global Link Imports. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
