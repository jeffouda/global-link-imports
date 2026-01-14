// Displays a single product in a card style with Tailwind
export default function ProductCard({ product }) {
  return (
    <div className="card-elevated p-6 hover:shadow-lg transition">
      {/* Product name */}
      <h3 className="font-bold text-lg text-foreground mb-2">{product.name}</h3>
      {/* Product category */}
      <p className="text-muted-foreground">{product.category}</p>
    </div>
  );
}
