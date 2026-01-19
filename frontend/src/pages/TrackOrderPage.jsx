import React, { useState } from 'react';
import { Search, ArrowRight, Package, Clock, Truck, CheckCircle, MapPin } from 'lucide-react';
import axios from 'axios';

const TrackOrderPage = () => {
  const [trackingId, setTrackingId] = useState('');
  const [shipmentData, setShipmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!trackingId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/shipments/track/${trackingId}`);
      setShipmentData(res.data);
    } catch (err) {
      setError('Shipment not found');
      setShipmentData(null);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTrack();
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Delivered': 'bg-emerald-100 text-emerald-800',
      'In Transit': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-amber-100 text-amber-800',
      'Processing': 'bg-amber-100 text-amber-800',
      'Cancelled': 'bg-rose-100 text-rose-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getStepStatus = (status) => {
    const statuses = ['Pending', 'Processing', 'In Transit', 'Delivered'];
    return statuses.indexOf(status);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-40 px-6 bg-gray-50 relative z-10">
      {/* Search Section */}
      <div className="w-full max-w-2xl text-center">
        <div className="bg-emerald-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <Search className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Shipment</h1>
        <p className="text-gray-600 mb-8">Enter your tracking number or order ID to see the current status...</p>

        <div className="relative mb-6">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter tracking number or order ID"
            className="w-full px-6 py-4 pr-32 text-lg border border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button
            onClick={handleTrack}
            disabled={loading}
            className="absolute right-2 top-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </div>

        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">Try these sample numbers:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span
              className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200"
              onClick={() => setTrackingId('GL-2024-001')}
            >
              GL-2024-001
            </span>
            <span
              className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200"
              onClick={() => setTrackingId('GL-2024-002')}
            >
              GL-2024-002
            </span>
          </div>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}
      </div>

      {/* Result Section */}
      {shipmentData && (
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-300">Tracking Number</p>
                <p className="text-2xl font-bold">{shipmentData.tracking_number}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(shipmentData.status)}`}>
                {shipmentData.status}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white p-6">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(getStepStatus(shipmentData.status) / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between">
                {[
                  { label: 'Order Placed', icon: Package },
                  { label: 'Processing', icon: Clock },
                  { label: 'In Transit', icon: Truck },
                  { label: 'Delivered', icon: CheckCircle }
                ].map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= getStepStatus(shipmentData.status);
                  return (
                    <div key={index} className="text-center">
                      <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-2 ${
                        isActive ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className={`text-xs ${isActive ? 'text-green-600' : 'text-gray-500'}`}>{step.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Origin</p>
                  <p className="font-semibold">{shipmentData.origin}</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-semibold">{shipmentData.destination}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Location</p>
                <p className="font-semibold">{shipmentData.current_location || shipmentData.origin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="font-semibold">{shipmentData.estimated_delivery || 'TBD'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                  shipmentData.payment === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {shipmentData.payment}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-[#0B1120] text-slate-400 py-8 text-center w-full">
        © 2026 GlobalLink. All rights reserved.
      </footer>
    </div>
  );
};

export default TrackOrderPage;