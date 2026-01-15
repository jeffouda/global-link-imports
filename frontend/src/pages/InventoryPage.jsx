// InventoryPage.jsx
// Displays a grid of products fetched from the Flask backend
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard"; // single product card component
import LoadingSpinner from "../components/LoadingSpinner"; // shows loading state
import BASE_URL from "../utils/api"; // base URL for backend

export default function InventoryPage() {
  const [products, setProducts] = useState([]); // stores products
  const [loading, setLoading] = useState(true); // loading indicator

  // Fetch products from backend on component mount
  useEffect(() => {
    fetch(`${BASE_URL}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data); // save to state
        setLoading(false); // hide spinner
      });
  }, []);

  // Show spinner while data loads
  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Section heading */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Inventory</h2>

      {/* Product grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
