import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { label: 'Dashboard', path: '/dashboard' },
    ...(user?.role !== 'driver' ? [{ label: 'New Shipment', path: '/create-shipment' }] : []),
    { label: 'Track Order', path: '/tracking' }
  ];

  return (
    <nav className="bg-slate-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold">Global Link</h1>
          <div className="flex space-x-6">
            {links.map(link => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={location.pathname === link.path ? 'text-teal-400 font-bold' : 'text-gray-300 hover:text-teal-400'}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="border border-red-500 text-white px-4 py-2 rounded hover:bg-red-500 hover:text-white transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
