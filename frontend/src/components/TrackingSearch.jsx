import { useEffect, useState } from "react";
// Ensure lucide-react is installed
import { Search } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import BASE_URL, { authHeaders } from "../utils/api";

export default function TrackingPage() {
  const [shipments, setShipments] = useState([]); // All shipments
  const [loading, setLoading] = useState(true);
  // State to handle search input
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch logic 
  useEffect(() => {
    fetch(`${BASE_URL}/shipments/my`, {
      headers: authHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array to prevent crashes
        setShipments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching shipments:", err);
        setLoading(false);
      });
  }, []);

  // Filter shipments based on the Search Term
  const filteredShipments = shipments.filter((s) => {
    if (!searchTerm) return true; // If search is empty, show all
    
    const term = searchTerm.toLowerCase();
    // Safely check fields (handling potential null values)
    const dest = s.destination ? s.destination.toLowerCase() : "";
    const status = s.status ? s.status.toLowerCase() : "";
    
    return dest.includes(term) || status.includes(term);
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        {/* Section Heading */}
        <h2 className="text-3xl font-bold text-gray-800">Track Shipments</h2>

        {/*  Search Bar*/}
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search destination or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Rendering the FILTERED list*/}
      <div className="grid gap-4">
        {filteredShipments.length > 0 ? (
          filteredShipments.map((s) => (
            <div key={s.id} className="bg-white p-4 rounded shadow border border-gray-100 hover:shadow-md transition-shadow">
              <p><strong>Destination:</strong> {s.destination}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`px-2 py-0.5 rounded text-sm ${
                  s.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {s.status}
                </span>
              </p>
              <p><strong>Payment:</strong> {s.payment_status}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            No shipments found matching "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  );
}