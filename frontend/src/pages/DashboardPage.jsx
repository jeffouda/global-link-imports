import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Clock, Truck, DollarSign, Plus, Trash2, Pencil, ArrowRight, CheckCircle, Search, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { deleteShipment, updateShipment, getShipments } from '../utils/mockApi';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const dummyShipments = [
    {
      id: 1,
      tracking: 'GLI-001',
      customer: 'John Doe',
      route: 'Nairobi → Mombasa',
      items: 'Electronics',
      status: 'In Transit',
      payment: 'Paid',
      estDelivery: '2023-01-15',
      customer_id: 3,
      driver_id: 2
    },
    {
      id: 2,
      tracking: 'GLI-002',
      customer: 'Jane Smith',
      route: 'Kisumu → Nairobi',
      items: 'Books',
      status: 'Pending',
      payment: 'Unpaid',
      estDelivery: '2023-01-16',
      customer_id: 3,
      driver_id: null
    },
    {
      id: 3,
      tracking: 'GLI-003',
      customer: 'Bob Johnson',
      route: 'Eldoret → Nakuru',
      items: 'Clothing',
      status: 'Delivered',
      payment: 'Paid',
      estDelivery: '2023-01-10',
      customer_id: 3,
      driver_id: 2
    },
    {
      id: 4,
      tracking: 'GLI-004',
      customer: 'Alice Brown',
      route: 'Nairobi → Kisumu',
      items: 'Furniture',
      status: 'In Transit',
      payment: 'Paid',
      estDelivery: '2023-01-17',
      customer_id: 3,
      driver_id: null
    },
    {
      id: 5,
      tracking: 'GLI-005',
      customer: 'Charlie Wilson',
      route: 'Mombasa → Nairobi',
      items: 'Groceries',
      status: 'Pending',
      payment: 'Unpaid',
      estDelivery: '2023-01-18',
      customer_id: 3,
      driver_id: null
    }
  ];

  const [shipments, setShipments] = useState([]);
  const [driverSearch, setDriverSearch] = useState('');
  const [editingShipment, setEditingShipment] = useState(null);
  const [formData, setFormData] = useState({});

  const MOCK_DRIVERS = [
    { id: 2, name: 'John Doe (Driver)' },
    { id: 4, name: 'Jane Smith (Driver)' },
    { id: 5, name: 'Mike Ross (Driver)' }
  ];

  useEffect(() => {
    getShipments().then(setShipments);
  }, []);


  // Derived variables (filter logic)
  const customerShipments = shipments.filter(s => s.customer_id === user.id);
  const driverShipmentsFiltered = shipments.filter(s => s.driver_id === user.id);
  const driverShipments = driverShipmentsFiltered.filter(shipment =>
    shipment.tracking.toLowerCase().includes(driverSearch.toLowerCase())
  );

  // Stats calculations
  const assignedDeliveries = driverShipmentsFiltered?.length || 0;
  const pendingPickup = driverShipmentsFiltered?.filter(s => s?.status === 'Pending').length || 0;
  const completedToday = driverShipmentsFiltered?.filter(s => s?.status === 'Delivered').length || 0;

  const activeOrders = customerShipments?.length || 0;
  const customerInTransit = customerShipments?.filter(s => s?.status === 'In Transit').length || 0;
  const customerDelivered = customerShipments?.filter(s => s?.status === 'Delivered').length || 0;

  const adminStats = [
    { icon: <Box className="w-6 h-6" />, value: 12, label: 'Total Shipments' },
    { icon: <Clock className="w-6 h-6" />, value: 3, label: 'Pending', color: 'text-orange-600' },
    { icon: <Truck className="w-6 h-6" />, value: 5, label: 'In Transit', color: 'text-blue-600' },
    { icon: <DollarSign className="w-6 h-6" />, value: 2, label: 'Payment Pending', color: 'text-red-600' }
  ];

  const driverStats = [
    { icon: <Truck className="w-6 h-6" />, value: assignedDeliveries, label: 'Assigned Deliveries', color: 'text-blue-600' },
    { icon: <Clock className="w-6 h-6" />, value: pendingPickup, label: 'Pending Pickup', color: 'text-orange-600' },
    { icon: <CheckCircle className="w-6 h-6" />, value: completedToday, label: 'Completed Today', color: 'text-green-600' }
  ];

  const customerStats = [
    { icon: <Box className="w-6 h-6" />, value: activeOrders, label: 'Active Orders', color: 'text-blue-600' },
    { icon: <Truck className="w-6 h-6" />, value: customerInTransit, label: 'In Transit', color: 'text-blue-600' },
    { icon: <CheckCircle className="w-6 h-6" />, value: customerDelivered, label: 'Delivered', color: 'text-green-600' }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-orange-100 text-orange-800',
      'Processing': 'bg-indigo-100 text-indigo-800',
      'In Transit': 'bg-cyan-100 text-cyan-800',
      'Delivered': 'bg-emerald-100 text-emerald-800',
      'Cancelled': 'bg-rose-100 text-rose-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentBadge = (payment) => {
    const styles = {
      'Paid': 'bg-green-100 text-green-800',
      'Pending': 'bg-orange-100 text-orange-800',
      'Unpaid': 'bg-red-100 text-red-800'
    };
    return styles[payment] || 'bg-gray-100 text-gray-800';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      try {
        await deleteShipment(id);
        setShipments(shipments.filter(s => s.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const canUpdateStatus = ['admin', 'driver'].includes(user?.role);

  const renderItems = (items) => {
    if (!items) return 'No items';
    if (typeof items === 'string') return items;
    if (Array.isArray(items)) {
      return items.map(item => {
        if (typeof item === 'object') {
          return `${item.product || item.product_id || 'Item'} (x${item.quantity})`;
        }
        return item;
      }).join(', ');
    }
    return 'Unknown Format';
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateShipment({ id, status: newStatus });
      setShipments(shipments.map(s => s.id === id ? { ...s, status: newStatus } : s));
      alert(`Status updated to ${newStatus}`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updates = { id: editingShipment.id, status: formData.status };
      if (user.role === 'admin') {
        updates.payment = formData.payment;
        updates.driver_id = formData.driver_id;
      }
      await updateShipment(updates);
      setShipments(shipments.map(s => s.id === editingShipment.id ? { ...s, ...updates } : s));
      setEditingShipment(null);
      alert('Changes saved successfully');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {(user.role === 'driver' ? driverStats : user.role === 'customer' ? customerStats : adminStats).map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className={`mr-4 ${stat.color || 'text-gray-600'}`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shipments Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {user.role === 'driver' ? 'Assigned Deliveries' : user.role === 'customer' ? 'Your Orders' : 'All Shipments'}
              </h2>
              {user.role === 'customer' && (
                <button onClick={() => navigate('/create-shipment')} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Shipment
                </button>
              )}
            </div>
          </div>
          {user.role === 'driver' ? (
            <div className="p-6">
              <div className="mb-6 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={driverSearch}
                  onChange={(e) => setDriverSearch(e.target.value)}
                  placeholder="Quick search by Tracking #..."
                  className="w-full pl-10 pr-10 py-3 bg-gray-100 border border-gray-300 rounded-lg"
                />
                {driverSearch && (
                  <button onClick={() => setDriverSearch('')} className="absolute right-3 top-3">
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                )}
              </div>
              {driverShipments.length === 0 && driverSearch ? (
                <p className="text-center text-gray-500 py-8">No shipments found matching that ID.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {driverShipments.map((shipment) => {
                    const origin = shipment.origin || (shipment.route ? shipment.route.split(' → ')[0]?.trim() : 'Unknown');
                    const destination = shipment.destination || (shipment.route ? shipment.route.split(' → ')[1]?.trim() : 'Unknown');
                    return (
                      <div key={shipment.id} className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition" onClick={() => setEditingShipment(shipment)}>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-teal-600 font-semibold">{shipment.tracking}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(shipment.status)}`}>{shipment.status}</span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between mb-4">
                          <span className="text-gray-700">{origin}</span>
                          <ArrowRight className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">{destination}</span>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Items</h4>
                          <p className="text-gray-600">{renderItems(shipment.items)}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{shipment.estDelivery}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentBadge(shipment.payment)}`}>{shipment.payment}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : user.role === 'customer' ? (
            <div className="p-6">
              {customerShipments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">You have no active shipments</p>
                  <button onClick={() => navigate('/create-shipment')} className="bg-teal-600 text-white px-6 py-3 rounded hover:bg-teal-700">
                    Create First Shipment
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customerShipments.map((shipment) => {
                    const origin = shipment.origin || (shipment.route ? shipment.route.split(' → ')[0]?.trim() : 'Unknown');
                    const destination = shipment.destination || (shipment.route ? shipment.route.split(' → ')[1]?.trim() : 'Unknown');
                    return (
                      <div key={shipment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-teal-600 font-semibold block">{shipment.tracking}</span>
                            <span className="text-sm text-gray-500">Created: {shipment.estDelivery}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(shipment.status)}`}>{shipment.status}</span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between mb-4">
                          <span className="text-gray-700">{origin}</span>
                          <ArrowRight className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">{destination}</span>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Items</h4>
                          <p className="text-gray-600">{renderItems(shipment.items)}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Est. Delivery: {shipment.estDelivery}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentBadge(shipment.payment)}`}>{shipment.payment}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Delivery</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shipments.map((shipment) => (
                    <tr key={shipment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shipment.tracking}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.origin ? `${shipment.origin} → ${shipment.destination}` : shipment.route}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderItems(shipment.items)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {canUpdateStatus ? (
                          <select
                            value={shipment.status}
                            onChange={(e) => handleStatusChange(shipment.id, e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        ) : (
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(shipment.status)}`}>
                            {shipment.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentBadge(shipment.payment)}`}>
                          {shipment.payment}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shipment.driver_id ? MOCK_DRIVERS.find(d => d.id === shipment.driver_id)?.name || 'Unknown Driver' : <span className="text-red-500">Unassigned</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.estDelivery}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {(user.role === 'admin' || user.role === 'driver') && (
                          <button onClick={() => setEditingShipment(shipment)} className="text-blue-500 hover:text-blue-700 p-2 rounded mr-2">
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {user.role === 'admin' && (
                          <button onClick={() => handleDelete(shipment.id)} className="text-red-500 hover:text-red-700 p-2 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editingShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Manage Shipment #{editingShipment.id}</h2>
            {user.role === 'admin' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Driver</label>
                <select
                  value={formData.driver_id || ''}
                  onChange={(e) => setFormData({ ...formData, driver_id: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Unassigned</option>
                  {MOCK_DRIVERS.map(driver => (
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
                className="w-full border border-gray-300 rounded px-3 py-2"
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
                  className="w-full border border-gray-300 rounded px-3 py-2"
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
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
