import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Gavel, Menu, Bell, LogOut } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import bravoLogo from '../../assets/bravo-logo.png';

export const AdminHeader = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-amber-500/20">
      <div className="px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Menu + Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="text-gray-300 hover:text-amber-500 transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/admin" className="flex items-center space-x-2 group">
              <img src={bravoLogo} alt="BRAVOCARS" className="h-10 w-auto transition-transform group-hover:scale-110" />
              <span className="text-2xl font-bold text-amber-500">BRAVOCARS Admin</span>
            </Link>
          </div>

          {/* Right: Notifications + Logout */}
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-300 hover:text-amber-500 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
            </button>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
