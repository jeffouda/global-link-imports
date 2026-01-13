// Shows a spinning loader while waiting for backend responses
export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
