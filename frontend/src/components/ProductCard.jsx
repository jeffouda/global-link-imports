// Displays a single product in a card style with Tailwind
export default function ProductCard({ product }) {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
      {/* Product name */}
      <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
      {/* Product category */}
      <p className="text-gray-600">{product.category}</p>
    </div>
  );
}
