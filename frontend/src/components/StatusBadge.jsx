import React from "react";

const StatusBadge = ({ status }) => {
  const styles = {
    Delivered: "bg-green-100 text-green-800 border-green-200",
    "In Transit": "bg-blue-100 text-blue-800 border-blue-200",
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Delayed: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
