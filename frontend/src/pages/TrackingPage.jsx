import React, { useState } from 'react';
import { Search, Truck, MapPin, Clock, CheckCircle, Package } from 'lucide-react';

const TrackingPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

  const handleTrack = () => {
    if (trackingNumber.trim()) {
      // Mock tracking result
      setTrackingResult({
        number: trackingNumber,
        status: 'In Transit',
        location: 'Nairobi Distribution Center',
        estimatedDelivery: '2024-01-16',
        updates: [
          { time: '2024-01-14 09:00', status: 'Package picked up', location: 'Origin Warehouse' },
          { time: '2024-01-14 14:30', status: 'In transit', location: 'En route to Nairobi' },
          { time: '2024-01-15 08:00', status: 'Arrived at facility', location: 'Nairobi Distribution Center' },
        ]
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="card-elevated p-6 animate-fadeIn">
        <div className="flex items-center space-x-3 mb-6">
          <Search className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Track Shipment</h1>
            <p className="text-muted-foreground">Enter your tracking number to get real-time updates</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter tracking number (e.g., GLI123456)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="form-input flex-1"
          />
          <button
            onClick={handleTrack}
            className="btn-primary whitespace-nowrap"
          >
            Track Shipment
          </button>
        </div>
      </div>

      {trackingResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Status Overview */}
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Tracking #{trackingResult.number}</h2>
                <p className="text-muted-foreground">Status: <span className="status-badge bg-secondary text-secondary-foreground">{trackingResult.status}</span></p>
              </div>
              <Truck className="w-12 h-12 text-secondary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">Current Location</div>
                  <div className="text-sm text-muted-foreground">{trackingResult.location}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">Estimated Delivery</div>
                  <div className="text-sm text-muted-foreground">{trackingResult.estimatedDelivery}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">Package Type</div>
                  <div className="text-sm text-muted-foreground">Standard Delivery</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Tracking History</h3>
            <div className="space-y-4">
              {trackingResult.updates.map((update, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{update.status}</p>
                      <p className="text-sm text-muted-foreground">{update.time}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{update.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingPage;