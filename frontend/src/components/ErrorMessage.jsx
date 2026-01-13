// Reusable component to display error messages in red
export default function ErrorMessage({ message }) {
  if (!message) return null; // nothing to show if no error

  return (
    <p className="text-red-600 text-sm mb-3">
      {message}
    </p>
  );
}
