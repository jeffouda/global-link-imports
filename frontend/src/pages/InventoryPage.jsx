// InventoryPage.jsx
// Displays a grid of products fetched from the Flask backend
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard"; // single product card component
import LoadingSpinner from "../components/LoadingSpinner"; // shows loading state
import { BASE_URL } from "../utils/api"; // base URL for backend
import { Search, Filter, Package } from "lucide-react";

export default function InventoryPage() {
  const [products, setProducts] = useState([]); // stores products
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true); // loading indicator
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch products from backend on component mount
  useEffect(() => {
    fetch(`${BASE_URL}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data); // save to state
        setFilteredProducts(data);
        setLoading(false); // hide spinner
      });
  }, []);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const categories = ["All", ...new Set(products.map(p => p.category))];

  // Show spinner while data loads
  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card-elevated p-6 animate-fadeIn">
        <div className="flex items-center space-x-3 mb-4">
          <Package className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card-elevated p-6 animate-fadeIn">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input pl-10 min-w-48"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
        <div className="card-elevated p-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl p-3 bg-primary/10">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{products.length}</div>
              <div className="text-sm text-muted-foreground">Total Products</div>
            </div>
          </div>
        </div>
        <div className="card-elevated p-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl p-3 bg-secondary/10">
              <Filter className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{categories.length - 1}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
          </div>
        </div>
        <div className="card-elevated p-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl p-3 bg-success/10">
              <Search className="w-6 h-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{filteredProducts.length}</div>
              <div className="text-sm text-muted-foreground">Filtered Results</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card-elevated p-12 text-center animate-fadeIn">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
