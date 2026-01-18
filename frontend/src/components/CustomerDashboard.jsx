import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Truck, CheckCircle, ArrowRight, Plus } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const sanitizeShipment = (data) => {
  return {
    ...data,
    items: Array.isArray(data.items) ? data.items : [],
    recipient: data.recipient || 'Unknown',
    weight: data.weight || 0,
    status: data.status || 'Pending'
  };
};

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const url = user.role === 'admin'
          ? 'http://localhost:5000/api/shipments/admin/all/'
          : 'http://localhost:5000/api/shipments/';
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Data Received:", res.data);
        console.log("Is Array?", Array.isArray(res.data));
        const rawData = Array.isArray(res.data) ? res.data : res.data.data || [];
        const sanitizedData = rawData.map(sanitizeShipment);
        setOrders(sanitizedData);
      } catch (err) {
        console.error("Error fetching shipments", err);
        if (err.response && err.response.status === 401) {
          // Force logout on unauthorized
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
      }
    };
    fetchShipments();
  }, [user.role]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status) => {
    return status === 'Paid' ? 'text-emerald-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 pt-20 px-4 sm:px-8 pb-10">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username || 'Customer'}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your shipments</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Box className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status !== 'Delivered').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'In Transit').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'Delivered').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
          <Link
            to="/create-shipment"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Shipment
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-mono text-teal-600">Tracking ID: #{order.id}</p>
                  <p className="text-xs text-gray-500">Tracking #: {order.tracking_number}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">{order.origin}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{order.destination}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Est. Delivery: TBD</span>
                <span className={getPaymentColor(order.payment_status)}>{order.payment_status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;