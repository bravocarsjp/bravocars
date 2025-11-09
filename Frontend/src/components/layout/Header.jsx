import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Gavel, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/button';
import useAuthStore from '../../stores/authStore';
import useAuth from '../../hooks/useAuth';
import bravoLogo from '../../assets/bravo-logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  // Derive authentication state
  const isAuthenticated = !!user;
  const isAdmin = user?.roles?.includes('Admin');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-amber-500/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img src={bravoLogo} alt="BRAVOCARS" className="h-10 w-auto transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold text-amber-500">BRAVOCARS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-amber-500 transition-colors font-medium">
              Home
            </Link>
            <Link to="/auctions" className="text-gray-300 hover:text-amber-500 transition-colors font-medium">
              Live Auctions
            </Link>
            <Link to="/how-it-works" className="text-gray-300 hover:text-amber-500 transition-colors font-medium">
              How It Works
            </Link>
            <Link to="/sell" className="text-gray-300 hover:text-amber-500 transition-colors font-medium">
              Sell Your Car
            </Link>
          </nav>

          {/* Desktop CTA / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" className="text-gray-300 hover:text-amber-500 hover:bg-amber-500/10">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Link to="/profile">
                  <Button variant="ghost" className="text-gray-300 hover:text-amber-500 hover:bg-amber-500/10">
                    <User className="w-4 h-4 mr-2" />
                    {user?.firstName || 'Profile'}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-amber-500 hover:bg-amber-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-amber-500 hover:bg-amber-500/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-amber-500 text-black hover:bg-amber-400 font-semibold">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-amber-500 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-amber-500/20 backdrop-blur-md">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:text-amber-500 transition-colors font-medium py-2"
            >
              Home
            </Link>
            <Link
              to="/auctions"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:text-amber-500 transition-colors font-medium py-2"
            >
              Live Auctions
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:text-amber-500 transition-colors font-medium py-2"
            >
              How It Works
            </Link>
            <Link
              to="/sell"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:text-amber-500 transition-colors font-medium py-2"
            >
              Sell Your Car
            </Link>

            <div className="pt-4 border-t border-amber-500/20 space-y-3">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full text-gray-300 hover:text-amber-500 hover:bg-amber-500/10 justify-start">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-gray-300 hover:text-amber-500 hover:bg-amber-500/10 justify-start">
                      <User className="w-4 h-4 mr-2" />
                      {user?.firstName || 'Profile'}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-gray-300 hover:text-amber-500 hover:bg-amber-500/10 justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-gray-300 hover:text-amber-500 hover:bg-amber-500/10">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-amber-500 text-black hover:bg-amber-400 font-semibold">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
