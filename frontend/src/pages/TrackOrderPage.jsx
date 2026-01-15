import React, { useState } from 'react';
import { Search, Box, Clock, Truck, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const TrackOrderPage = () => {
  const [query, setQuery] = useState('');
  const [trackingData, setTrackingData] = useState(null);

  const MOCK_SHIPMENT = {
    trackingNumber: 'GLI-2024-001234',
    status: 'In Transit',
    origin: 'Nairobi',
    destination: 'Mombasa',
    orderDate: '2024-01-10',
    estDelivery: '2024-01-20',
    paymentStatus: 'Paid',
    items: ['Electronics Bundle x50', 'Office Supplies x20']
  };

  const handleTrack = () => {
    if (query.trim() === MOCK_SHIPMENT.trackingNumber) {
      setTrackingData(MOCK_SHIPMENT);
    } else {
      alert('Tracking number not found');
      setTrackingData(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'In Transit': 'bg-blue-100 text-blue-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto p-6 max-w-4xl">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Track Your Shipment</h1>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter tracking number (e.g., GLI-2024-001234)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleTrack}
              className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition"
            >
              Track Order
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Try these sample numbers:</p>
            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200" onClick={() => setQuery('GLI-2024-001234')}>GLI-2024-001234</span>
          </div>
        </div>

        {/* Result Section */}
        {trackingData && (
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-300">Tracking Number</p>
                  <p className="text-2xl font-bold">{trackingData.trackingNumber}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(trackingData.status)}`}>
                  {trackingData.status}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              {/* Route Row */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Origin</p>
                  <p className="text-lg font-semibold">{trackingData.origin}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="text-lg font-semibold">{trackingData.destination}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  {['Order Placed', 'Processing', 'In Transit', 'Delivered'].map((step, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${index < 3 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                        {index === 0 && <Box className="w-4 h-4" />}
                        {index === 1 && <Clock className="w-4 h-4" />}
                        {index === 2 && <Truck className="w-4 h-4" />}
                        {index === 3 && <CheckCircle className="w-4 h-4" />}
                      </div>
                      <p className="text-xs mt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold">{trackingData.orderDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Est. Delivery</p>
                  <p className="font-semibold">{trackingData.estDelivery}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">{trackingData.paymentStatus}</span>
                </div>
              </div>

              {/* Items Section */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Items in Shipment</h3>
                <div className="space-y-2">
                  {trackingData.items.map((item, index) => {
                    const [name, quantity] = item.split(' x');
                    return (
                      <div key={index} className="flex justify-between items-center px-6 py-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{name}</span>
                        <span className="text-gray-500">{quantity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;