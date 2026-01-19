import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Box, Plus, Trash2, Package, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CreateShipmentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const API_BASE = 'http://localhost:5000/api';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')?.replace(/"/g, '');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [recipient, setRecipient] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [products, setProducts] = useState([{ product: '', quantity: 1 }]);

  const MOCK_PRODUCTS = ['Electronics', 'Office Supplies', 'Medical Equipment', 'Clothing', 'Books', 'Furniture'];

  const addProduct = () => {
    setProducts([...products, { product: '', quantity: 1 }]);
  };

  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index, field, value) => {
    const updated = products.map((prod, i) =>
      i === index ? { ...prod, [field]: value } : prod
    );
    setProducts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!origin.trim() || !destination.trim() || !recipient.trim() || !weight || products.some(p => !p.product || p.quantity <= 0)) {
      alert('Please fill in all required fields.');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please log in to create a shipment.');
      return;
    }

    if (!user || !user.id) {
      alert('User not authenticated.');
      return;
    }

    const payload = {
      customer_id: user.id,
      origin: origin || 'Nairobi',
      destination,
      recipient,
      weight: parseFloat(weight),
      notes,
      items: products.map(p => ({ product_id: 1, quantity: p.quantity })) // Using mock product_id for now
    };

    const cleanedPayload = {
      customer_id: payload.customer_id,
      origin: payload.origin,
      destination: payload.destination,
      weight: payload.weight,
      recipient: payload.recipient,
      notes: payload.notes
    };

    console.log("Sending Payload:", cleanedPayload);

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      const response = await axios.post(`${API_BASE}/shipments/`, cleanedPayload, config);
      alert('Shipment Created!');
      localStorage.setItem('refreshDashboard', Date.now().toString());
      navigate('/dashboard');
    } catch (err) {
      alert('Error creating shipment: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 pt-28 px-4 pb-10">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <Box className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Create New Shipment</h1>
          <p className="text-gray-600 mt-2">Fill out the form below to create a new shipment.</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                Shipping Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origin Location</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., Nairobi"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., Mombasa"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., 5.5"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-emerald-600" />
                Products
              </h2>
              <div className="space-y-4">
                {products.map((prod, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <select
                        value={prod.product}
                        onChange={(e) => updateProduct(index, 'product', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Product</option>
                        {MOCK_PRODUCTS.map(product => (
                          <option key={product} value={product}>{product}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        min="1"
                        value={prod.quantity}
                        onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="p-3 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProduct}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-emerald-500 hover:text-emerald-500 transition flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Product
                </button>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                Additional Notes
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Any special instructions or notes..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition"
              >
                Create Shipment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateShipmentPage;
