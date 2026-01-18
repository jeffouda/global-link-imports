import { Link, useNavigate } from 'react-router-dom';
import { Truck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = '/'; // Forces a full reload to the home page
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0B1120] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Truck className="h-8 w-8" />
              <span className="font-bold text-xl">GlobalLink</span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-6">
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium hover:text-emerald-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/create-shipment"
                    className="text-sm font-medium hover:text-emerald-400 transition-colors"
                  >
                    New Shipment
                  </Link>
                  <Link
                    to="/tracking"
                    className="text-sm font-medium hover:text-emerald-400 transition-colors"
                  >
                    Track Order
                  </Link>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{user?.username || 'User'}</div>
                    <div className="text-xs text-slate-400 capitalize">{user?.role || 'Customer'}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
