// Allows users to track their shipments
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import BASE_URL, { authHeaders } from "../utils/api";

export default function TrackingPage() {
  const [shipments, setShipments] = useState([]); // current user's shipments
  const [loading, setLoading] = useState(true); // loading state

  // Fetch user's shipments on component mount
  useEffect(() => {
    fetch(`${BASE_URL}/shipments/my`, {
      headers: authHeaders(), // attach JWT
    })
      .then(res => res.json())
      .then(data => {
        setShipments(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Section heading */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Track Shipments</h2>

      {/* Shipment cards */}
      {shipments.map(s => (
        <div key={s.id} className="bg-white p-4 rounded shadow mb-4">
          <p><strong>Destination:</strong> {s.destination}</p>
          <p><strong>Status:</strong> {s.status}</p>
          <p><strong>Payment:</strong> {s.payment_status}</p>
        </div>
      ))}
    </div>
  );
}
