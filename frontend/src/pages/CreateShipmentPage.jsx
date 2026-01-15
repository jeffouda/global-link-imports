import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Box, Plus, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { mockCreateShipment } from '../utils/mockApi';

const CreateShipmentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
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
    if (!origin.trim() || !destination.trim() || products.some(p => !p.product || p.quantity <= 0)) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await mockCreateShipment({ destination, items: products }, user);
      alert('Shipment Created!');
      navigate('/dashboard');
    } catch (err) {
      alert('Error creating shipment: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Shipment</h1>
          <p className="text-gray-600 mt-2">Fill out the form below to create a new shipment.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origin Location</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., Mombasa"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Box className="w-5 h-5 mr-2" />
                Products
              </h2>
              <div className="space-y-4">
                {products.map((prod, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <select
                        value={prod.product}
                        onChange={(e) => updateProduct(index, 'product', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-teal-500 hover:text-teal-500 transition flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Another Product
                </button>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Any special instructions or notes..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-teal-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-teal-600 transition"
              >
                Create Shipment
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateShipmentPage;
