import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Clock, Truck, DollarSign, Plus, Trash2, Pencil, ArrowRight, CheckCircle, Search, X, FileText } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';
import CustomerDashboard from '../components/CustomerDashboard';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const API_BASE = 'http://localhost:5000/api';

  const [shipments, setShipments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [driverSearch, setDriverSearch] = useState('');
  const [editingShipment, setEditingShipment] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')?.replace(/"/g, '');
    console.log('Sending Token:', token);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Helper function to map backend shipment to frontend format
  const mapShipment = (s) => ({
    id: s.id,
    tracking: s.tracking,
    status: s.status,
    origin: s.origin,
    destination: s.destination,
    payment: s.payment,
    customerId: s.customer_id,
    customerEmail: s.customerEmail,
    driverId: s.driver_id,
    driverName: s.driverName,
    createdAt: s.created_at,
    items: s.items ? s.items.map(i => ({ product: 'Product ' + i.product_id, quantity: i.quantity })) : []
  });

  const MOCK_DRIVERS = [
    { id: 2, name: 'Driver User', email: 'driver@global.com' },
    { id: 5, name: 'Second Driver' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No token found! Redirecting to login...');
      navigate('/login');
      return;
    }
    if (user.role === 'admin') {
      loadDrivers();
    }

    // Initial load
    loadShipments();
    // Set up polling every 5 seconds
    const intervalId = setInterval(() => {
        loadShipments();
    }, 5000); // 5000ms = 5 seconds

    const handleFocus = () => loadShipments();
    window.addEventListener('focus', handleFocus);

    // Check for refresh flag from create page
    const refreshFlag = localStorage.getItem('refreshDashboard');
    if (refreshFlag) {
      localStorage.removeItem('refreshDashboard');
      loadShipments();
    }

    // Cleanup on unmount to prevent memory leaks
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, []); // Keep dependency array empty so it sets up once

  // Add this to fix the Edit Form!
  useEffect(() => {
    if (editingShipment) {
      setFormData({
        status: editingShipment.status,
        driverId: editingShipment.driverId,
        payment: editingShipment.payment
      });
    }
  }, [editingShipment]);

  // Variable Separation
  // Backend already filters based on role, so shipments is appropriate for each user
  const allShipments = shipments;
  const myShipments = shipments; // Already filtered by backend for customers
  const driverAssignments = shipments; // Already filtered by backend for drivers
  const driverShipments = driverAssignments.filter(shipment =>
    shipment.tracking.toLowerCase().includes(driverSearch.toLowerCase())
  );

  // Filtered shipments for display based on search query
  const displayedShipments = allShipments.filter(shipment =>
    shipment.tracking.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.id.toString().includes(searchQuery)
  );

  // Stats calculations based on role
  const getStats = () => {
    if (user.role === 'admin') {
      return [
        { icon: <Box className="w-6 h-6" />, value: allShipments.length, label: 'Total Shipments' },
        { icon: <Clock className="w-6 h-6" />, value: allShipments.filter(s => s.status === 'Pending').length, label: 'Pending', color: 'text-orange-600' },
        { icon: <Truck className="w-6 h-6" />, value: allShipments.filter(s => s.status === 'In Transit').length, label: 'In Transit', color: 'text-blue-600' },
        { icon: <DollarSign className="w-6 h-6" />, value: allShipments.filter(s => s.payment === 'Unpaid').length, label: 'Payment Pending', color: 'text-red-600' }
      ];
    } else if (user.role === 'driver') {
      return [
        { icon: <Truck className="w-6 h-6" />, value: driverShipments.length, label: 'Assigned Deliveries', color: 'text-blue-600' },
        { icon: <Clock className="w-6 h-6" />, value: driverShipments.filter(s => s.status === 'Pending').length, label: 'Pending Pickup', color: 'text-orange-600' },
        { icon: <CheckCircle className="w-6 h-6" />, value: driverShipments.filter(s => s.status === 'Delivered').length, label: 'Completed Today', color: 'text-green-600' }
      ];
    } else { // customer
      return [
        { icon: <Box className="w-6 h-6" />, value: myShipments.length, label: 'Active Orders', color: 'text-blue-600' },
        { icon: <Truck className="w-6 h-6" />, value: myShipments.filter(s => s.status === 'In Transit').length, label: 'In Transit', color: 'text-blue-600' },
        { icon: <CheckCircle className="w-6 h-6" />, value: myShipments.filter(s => s.status === 'Delivered').length, label: 'Delivered', color: 'text-green-600' }
      ];
    }
  };

  const loadDrivers = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/users/drivers`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
      }
    } catch (err) {
      console.error('Error loading drivers:', err);
    }
  };

  const loadShipments = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No token found! Cannot fetch shipments.');
      return;
    }
    try {
      console.log('Current Token:', token);
      const response = await fetch(`${API_BASE}/shipments`, {
        headers: getAuthHeaders()
      });
      if (response.status === 401) {
        navigate('/login');
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        throw new Error('Failed to fetch shipments');
      }
      const data = await response.json();
      setShipments(data.map(mapShipment));
    } catch (error) {
      console.error('Error loading shipments:', error);
      setError('Failed to load shipments');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-amber-100 text-amber-700',
      'Processing': 'bg-amber-100 text-amber-700',
      'In Transit': 'bg-blue-100 text-blue-700',
      'Delivered': 'bg-emerald-100 text-emerald-700',
      'Cancelled': 'bg-rose-100 text-rose-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentBadge = (payment) => {
    const styles = {
      'Paid': 'bg-emerald-100 text-emerald-700',
      'Pending': 'bg-amber-100 text-amber-700',
      'Unpaid': 'bg-rose-100 text-rose-700'
    };
    return styles[payment] || 'bg-gray-100 text-gray-700';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      try {
        const response = await fetch(`${API_BASE}/shipments/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to delete shipment');
        }
        await loadShipments(); // Refresh data
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const canUpdateStatus = ['admin', 'driver'].includes(user?.role);
  const isDriver = user?.role === 'driver';

  const renderItems = (items) => {
    if (Array.isArray(items)) {
      return items.map(i => typeof i === 'object' ? `${i.product} (x${i.quantity})` : i).join(', ');
    }
    return items || 'No items';
  };

  const handleStatusChange = async (id, newStatus) => {
    // Find the shipment to check payment status
    const shipment = shipments.find(s => s.id === id);
    if (newStatus === 'Delivered' && shipment.payment !== 'Paid') {
      alert('Compliance Alert: Payment is not settled. You cannot deliver this package.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/shipments/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (response.status === 401) {
        navigate('/login');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      await loadShipments(); // Refresh data
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const cleanDriverId = formData.driverId ? parseInt(formData.driverId, 10) : null;
      const updates = {
        status: formData.status,
        driver_id: cleanDriverId
      };
      if (user.role === 'admin') {
        updates.payment_status = formData.payment;
      }
      const response = await fetch(`${API_BASE}/shipments/${editingShipment.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (response.status === 401) {
        navigate('/login');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to update shipment');
      }
      await loadShipments(); // Refresh to ensure real-time updates
      setEditingShipment(null);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Debugging Aid
  console.log('Role:', user.role, 'Total Shipments:', allShipments.length);

  if (user.role === 'customer') {
    return <CustomerDashboard />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.username || 'User'}!</p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Track by Shipment ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {user.role !== 'driver' && (
            <button
              onClick={() => navigate('/create-shipment')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Create Shipment
            </button>
          )}
        </div>
      </div>
      <ErrorMessage message={error} />

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {getStats().map((stat, index) => (
          <div key={index} className="bg-white p-4 border border-gray-300">
            <div className="flex items-center">
              <div className={`mr-4 p-2 ${stat.color || 'text-gray-600'}`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Shipments Table */}
      <div className="bg-white border border-gray-300">
        <div className="p-4 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-gray-900">Shipments</h3>
        </div>
        {allShipments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No shipments found. Create one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tracking ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    {user.role === 'admin' ? 'Customer' : 'Driver'}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedShipments.slice(0, 10).map((shipment) => (
                  <tr key={shipment.id}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 font-mono">{shipment.tracking}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {user.role === 'admin' ? shipment.customerEmail : shipment.driverName || 'Unassigned'}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium ${getStatusBadge(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium ${getPaymentBadge(shipment.payment)}`}>
                        {shipment.payment}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {shipment.notes ? (
                        <FileText
                          className="w-5 h-5 cursor-pointer text-blue-500 hover:text-blue-700"
                          onClick={() => alert(shipment.notes)}
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {isDriver ? (
                        <>
                          <button
                            onClick={() => handleStatusChange(shipment.id, 'Delivered')}
                            disabled={shipment.payment !== 'Paid'}
                            className={`px-3 py-1 text-sm rounded ${
                              shipment.payment === 'Paid'
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            title={shipment.payment !== 'Paid' ? 'Payment Required' : ''}
                          >
                            Mark Delivered
                          </button>
                        </>
                      ) : user.role === 'admin' ? (
                        <>
                          <select
                            value={shipment.status}
                            onChange={(e) => handleStatusChange(shipment.id, e.target.value)}
                            className="mr-2 px-2 py-1 border border-gray-300 text-sm"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                          <button onClick={() => setEditingShipment(shipment)} className="text-blue-600 hover:text-blue-800 mr-2">
                            Assign Driver
                          </button>
                          <button onClick={() => handleDelete(shipment.id)} className="text-red-600 hover:text-red-800">
                            Delete
                          </button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 border border-gray-300 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Manage Shipment #{editingShipment.id}</h2>
            {user.role === 'admin' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Driver</label>
                <select
                  value={formData.driverId || ''}
                  onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2"
                >
                  <option value="">Unassigned</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>{driver.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            {user.role === 'admin' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={formData.payment}
                  onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingShipment(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
