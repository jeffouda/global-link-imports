import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Eye, Package, Truck } from "lucide-react";

const ShipmentListPage = () => {
  const [shipments, setShipments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Replace with your actual API endpoint
    axios
      .get("/api/shipments")
      .then((res) => setShipments(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="text-blue-600" /> Shipment Dashboard
        </h1>
        <button
          onClick={() => navigate("/create")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> New Shipment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Tracking ID
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Recipient
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {shipments.map((s) => (
              <tr key={s.id} className="hover:bg-blue-50/30 transition">
                <td className="px-6 py-4 font-mono text-sm text-blue-600 uppercase">
                  {s.id}
                </td>
                <td className="px-6 py-4 text-gray-700">{s.recipient}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full w-fit">
                    <Truck size={12} /> {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => navigate(`/details/${s.id}`)}
                    className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipmentListPage;
