import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Truck, Package, Users, Settings, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SidebarLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Truck },
    { name: 'Shipments', href: '/shipments', icon: Package },
    { name: 'Drivers', href: '/drivers', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900">
            <SidebarContent navigation={navigation} location={location} user={user} logout={logout} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64 lg:bg-slate-900">
        <SidebarContent navigation={navigation} location={location} user={user} logout={logout} />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-3 p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <Link to="/" className="text-slate-500 hover:text-slate-700">Home</Link>
                  </li>
                  <li className="text-slate-400">/</li>
                  <li className="text-slate-900 font-medium">
                    {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                  </li>
                </ol>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {location.pathname === '/dashboard' && (
                <Link
                  to="/create-shipment"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Shipment
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="px-4 py-6 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ navigation, location, user, logout }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-slate-200">
        <Truck className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-bold text-slate-800">GlobalLink</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="px-4 py-4 border-t border-slate-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
              <User className="h-4 w-4 text-slate-600" />
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{user?.username}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="ml-2 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}