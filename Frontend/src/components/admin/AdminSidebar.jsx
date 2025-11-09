import React from 'react';
import { LayoutDashboard, Car, Users, Activity, Clock, Settings } from 'lucide-react';

export const AdminSidebar = ({ currentView, onViewChange, isOpen }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'auctions', label: 'Auctions', icon: Car },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity', label: 'Bid Activity', icon: Activity },
    { id: 'approvals', label: 'Pending Approvals', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`fixed left-0 top-20 bottom-0 w-64 bg-zinc-950 border-r border-amber-500/20 transition-transform duration-300 z-40 overflow-y-auto ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      <nav className="p-4 space-y-2 pb-24">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                  : 'text-gray-400 hover:bg-zinc-900 hover:text-amber-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
