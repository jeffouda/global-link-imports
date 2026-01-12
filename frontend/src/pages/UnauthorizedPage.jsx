import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-page">
      <h2>Unauthorized Access</h2>
      <p>You do not have permission to view this page.</p>
      <Link to="/dashboard">
        <button>Go Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
