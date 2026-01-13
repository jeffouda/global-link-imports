import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import TrackingSearch from "./TrackingSearch";

const mockData = [
  {
    id: "LOG-8821",
    origin: "Shanghai",
    destination: "Los Angeles",
    status: "In Transit",
    eta: "2024-05-20",
  },
  {
    id: "LOG-4432",
    origin: "Berlin",
    destination: "London",
    status: "Delivered",
    eta: "2024-05-12",
  },
  {
    id: "LOG-9001",
    origin: "Singapore",
    destination: "Dubai",
    status: "Pending",
    eta: "2024-05-25",
  },
];

const ShipmentTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredShipments = mockData.filter(
    (shipment) =>
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Global Shipments</h1>
        <TrackingSearch onSearch={setSearchTerm} />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tracking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ETA
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredShipments.map((shipment) => (
              <tr
                key={shipment.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                  {shipment.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {shipment.origin} → {shipment.destination}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={shipment.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {shipment.eta}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button className="text-blue-600 hover:text-blue-900 font-semibold">
                    Details
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

export default ShipmentTable;
