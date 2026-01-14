// Modal window to add a new product (admin only)
export default function AddProductModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Add Product</h3>
        <p className="text-gray-600">Admin only feature</p>

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
