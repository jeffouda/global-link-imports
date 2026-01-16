import React from "react";
import { Package, MapPin, Calendar } from "lucide-react";
import StatusBadge from "./StatusBadge";

const ShipmentCard = ({ shipment }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-gray-900">{shipment.id}</span>
        </div>
        <StatusBadge status={shipment.status} />
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>Destination: {shipment.destination}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Created: {new Date(shipment.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ShipmentCard;
