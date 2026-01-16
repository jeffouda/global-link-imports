import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Package, Users, Truck, Plus } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getMenuItems = () => {
    if (!user) return [];

    const role = user.role;
    switch (role) {
      case 'admin':
        return [
          { label: 'All Shipments', path: '/shipments', icon: Package },
          { label: 'Manage Users', path: '/users', icon: Users },
        ];
      case 'driver':
        return [
          { label: 'Assigned Shipments', path: '/shipments', icon: Truck },
        ];
      case 'customer':
        return [
          { label: 'My Shipments', path: '/shipments', icon: Package },
          { label: 'Create Shipment', path: '/create-shipment', icon: Plus },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen`}>
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <h2 className="text-xl font-bold text-teal-400">GlobaLink</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded hover:bg-slate-800"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-teal-400 text-slate-900' : 'hover:bg-slate-800'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <item.icon size={20} className={isCollapsed ? '' : 'mr-3'} />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;