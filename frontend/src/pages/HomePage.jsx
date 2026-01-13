import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="homepage">
      <h2>Welcome to Global Link Imports</h2>
      <p>
        Track shipments, manage deliveries, and monitor your orders all in one
        place.
      </p>
      <Link to="/dashboard">
        <button>Go to Dashboard</button>
      </Link>
    </div>
  );
};

export default Homepage;
