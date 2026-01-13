import React from "react";

const DashboardPage = ({ userRole }) => {
  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>
      {userRole === "admin" && (
        <div>
          <h3>Admin Overview</h3>
          <p>View active shipments, payments, and fleet management.</p>
        </div>
      )}

      {userRole === "driver" && (
        <div>
          <h3>Driver Dashboard</h3>
          <p>See your assigned shipments and update statuses.</p>
        </div>
      )}

      {userRole === "customer" && (
        <div>
          <h3>Customer Dashboard</h3>
          <p>Check the status of your orders and payments.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
