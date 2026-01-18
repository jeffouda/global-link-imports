import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        {children}
      </div>
    </div>
  );
}
