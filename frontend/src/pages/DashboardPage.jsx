import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Clock, Truck, DollarSign, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';
import CustomerDashboard from '../components/CustomerDashboard';
import { useAuth } from '../context/AuthContext';


const safeList = (list) => Array.isArray(list) ? list : [];
const safeString = (str) => (str || "").toString();
const safeNumber = (num) => (num === null || num === undefined || isNaN(num)) ? 0 : Number(num);

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
  const [isScrolled, setIsScrolled] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')?.replace(/"/g, '');
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  };

  // ROBUST DATA MAPPING
  const mapShipment = (s) => ({
    id: s.id,
    // Check multiple possible names for tracking
    tracking: safeString(s.tracking || s.tracking_number || s.tracking_id || "PENDING"),
    status: s.status || "Pending",
    origin: s.origin || "Unknown",
    destination: s.destination || "Unknown",
    // Check payment_status if payment is null
    payment: s.payment || s.payment_status || "Unpaid",
    customerId: s.customer_id,
    // FIX: Fallback chain for customer name
    customerName: s.customer_name || s.customer?.username || s.user?.username || "Name Unavailable",
    customerEmail: s.customerEmail || s.customer_email || s.email || (s.user ? s.user.email : ""),
    driverId: s.driver_id,
    driverName: s.driverName || (s.driver ? s.driver.username : "Unassigned"),
    createdAt: s.created_at,
    // FIX: Ensure notes are captured
    notes: s.notes || s.description || "",
    items: safeList(s.items).map(i => ({
      product: 'Product ' + (i.product_id || '?'),
      quantity: safeNumber(i.quantity)
    }))
  });

  // --- LOAD DATA ---
  const loadShipments = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/shipments`, { headers: getAuthHeaders() });
      if (response.status === 401) { navigate('/login'); return; }
      if (!response.ok) throw new Error('Failed to fetch shipments');
      
      const data = await response.json();
      console.log('Raw API response:', data);

      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data.shipments) list = data.shipments;
      else if (data.data) list = data.data;

      const mapped = list.map(mapShipment);
      console.log('Mapped shipments:', mapped);
      setShipments(mapped);
    } catch (error) {
      console.error(error);
      setError('Failed to load shipments');
    }
  };

  const loadDrivers = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/users/drivers`, { headers: getAuthHeaders() });
      if (response.ok) setDrivers(await response.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!localStorage.getItem('access_token')) { navigate('/login'); return; }
    if (user.role === 'admin') loadDrivers();

    loadShipments();
    const interval = setInterval(loadShipments, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- POPULATE EDIT FORM ---
  useEffect(() => {
    if (editingShipment) {
      setFormData({
        status: editingShipment.status,
        driverId: editingShipment.driverId,
        payment: editingShipment.payment 
      });
    }
  }, [editingShipment]);

  // --- 2. FIX UPDATE LOGIC (Fixes Payment Status) ---
  const handleSaveChanges = async () => {
    // Driver restriction: Cannot mark as Delivered if not paid
    if (user.role === 'driver' && formData.status === 'Delivered' && formData.payment !== 'Paid') {
      alert('Cannot mark as delivered until payment is Paid.');
      return;
    }

    try {
      const cleanDriverId = formData.driverId ? parseInt(formData.driverId, 10) : null;

      // Construct payload carefully
      const updates = {
        status: formData.status,
        driver_id: cleanDriverId,
        // FIX: Send BOTH keys to be safe. Backend will pick the one it needs.
        payment: formData.payment,
        payment_status: formData.payment
      };

      console.log("Sending Update:", updates); // Debug log

      const response = await fetch(`${API_BASE}/shipments/${editingShipment.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update shipment');

      // Update local state immediately to prevent reverting
      setShipments(shipments.map(s => s.id === editingShipment.id ? { ...s, ...updates } : s));
      setEditingShipment(null);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`${API_BASE}/shipments/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      // Update local state immediately
      setShipments(shipments.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete shipment?')) {
      try {
        await fetch(`${API_BASE}/shipments/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        loadShipments();
      } catch (err) { setError(err.message); }
    }
  };

  // --- FILTERS ---
  const filteredShipments = shipments.filter(shipment => {
    const track = safeString(shipment.tracking).toLowerCase();
    const id = safeString(shipment.id);
    const query = safeString(searchQuery).toLowerCase();
    return track.includes(query) || id.includes(query);
  });

  const getStats = () => [
    { icon: <Box className="w-6 h-6 text-purple-600" />, value: shipments.length, label: 'Total' },
    { icon: <Clock className="w-6 h-6 text-orange-600" />, value: shipments.filter(s => s.status === 'Pending').length, label: 'Pending' },
    { icon: <Truck className="w-6 h-6 text-blue-600" />, value: shipments.filter(s => s.status === 'In Transit').length, label: 'In Transit' },
    { icon: <DollarSign className="w-6 h-6 text-red-600" />, value: shipments.filter(s => ['Unpaid', 'Pending'].includes(s.payment)).length, label: 'Unpaid' }
  ];

  if (user.role === 'customer') return <CustomerDashboard />;

  return (
    <div className="min-h-screen bg-slate-50 w-full pt-24">
      <div className="pb-10 max-w-7xl mx-auto px-4">

      {/* HEADER */}
      <div className="bg-white p-6 mb-6 flex justify-between items-center rounded-lg shadow-sm mt-4 transition-all duration-300 ${isScrolled ? 'opacity-0 -translate-y-10' : 'opacity-100 translate-y-0'}">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {user.role === 'driver' ? 'Driver Dashboard' : 'Admin Dashboard'}
          </h1>
          <p className="text-slate-500">
            {user.role === 'driver' ? 'View your assigned deliveries and update status' : 'Overview of all logistics'}
          </p>
        </div>
        {user.role !== 'driver' && (
          <button onClick={() => navigate('/create-shipment')} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            + New Shipment
          </button>
        )}
      </div>

      <ErrorMessage message={error} />

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {getStats().map((stat, i) => (
          <div key={i} className="bg-white p-3 rounded-xl shadow-sm flex items-center">
            <div className="mr-3">{stat.icon}</div>
            <div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by ID or Tracking..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 p-2 border rounded shadow-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-2">Tracking</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Payment</th>
                {user.role !== 'driver' && <th className="px-4 py-2">Notes</th>}
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.length === 0 ? (
                <tr><td colSpan={user.role === 'driver' ? 5 : 6} className="p-4 text-center text-gray-500">No shipments found</td></tr>
              ) : (
                filteredShipments.map((s) => {
                  console.log(s);
                  return (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-cyan-600 text-sm">
                      {s.tracking}
                      <div className="text-xs text-gray-400">ID: {s.id}</div>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {s.customerName}
                      <div className="text-xs text-gray-400">{s.origin} → {s.destination}</div>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        s.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        s.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        s.payment === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {s.payment}
                      </span>
                    </td>

                    {/* NOTES COLUMN - Hidden for Drivers */}
                    {user.role !== 'driver' && (
                      <td className="px-4 py-2">
                        {s.notes ? (
                          <div className="group relative">
                            <FileText className="w-5 h-5 text-gray-500 cursor-pointer" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs p-2 rounded hidden group-hover:block w-48 z-10">
                              {s.notes}
                            </div>
                          </div>
                        ) : <span className="text-gray-300">-</span>}
                      </td>
                    )}

                    <td className="px-4 py-2 flex gap-2 text-sm">
                      <button onClick={() => setEditingShipment(s)} className="text-blue-600 hover:underline">Edit</button>
                      {user.role !== 'driver' && (
                        <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline">Delete</button>
                      )}
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Shipment #{editingShipment.id}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered" disabled={user.role === 'driver' && formData.payment !== 'Paid'}>
                    Delivered{user.role === 'driver' && formData.payment !== 'Paid' ? ' (Payment Required)' : ''}
                  </option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {user.role === 'driver' && formData.payment !== 'Paid' && (
                  <p className="text-xs text-red-600 mt-1">Payment Required to mark as Delivered</p>
                )}
              </div>

              {user.role !== 'driver' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Status</label>
                    <select
                      value={formData.payment}
                      onChange={(e) => setFormData({...formData, payment: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Assign Driver</label>
                    <select
                      value={formData.driverId || ""}
                      onChange={(e) => setFormData({...formData, driverId: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">-- Unassigned --</option>
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditingShipment(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={handleSaveChanges} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default DashboardPage;