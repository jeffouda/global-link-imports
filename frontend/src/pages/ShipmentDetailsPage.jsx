import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Calendar, User, ArrowLeft } from "lucide-react";

const ShipmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    axios.get(`/api/shipments/${id}`).then((res) => setDetails(res.data));
  }, [id]);

  if (!details)
    return <div className="p-10 text-center">Loading shipment data...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft size={18} className="mr-1" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <User className="text-blue-500" size={20} /> Customer Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{details.recipient}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Address</span>
              <span className="font-medium text-right">{details.address}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin size={20} /> Logistics Info
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-blue-100 text-xs uppercase">Current Status</p>
              <p className="text-xl font-bold">{details.status}</p>
            </div>
            <div>
              <p className="text-blue-100 text-xs uppercase">
                Estimated Delivery
              </p>
              <div className="flex items-center gap-2">
                <Calendar size={14} /> <span>Jan 15, 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsPage;
