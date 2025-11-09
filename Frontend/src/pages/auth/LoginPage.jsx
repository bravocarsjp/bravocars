import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import bravoLogo from '../../assets/bravo-logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(credentials);

    if (result.success) {
      // Get the user to check roles
      const userData = result.data?.data?.user;
      const isAdmin = userData?.roles?.includes('Admin');

      // Redirect admin to admin dashboard, others to auctions
      navigate(isAdmin ? '/admin' : '/auctions');
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #d4af37 1px, transparent 1px), linear-gradient(to bottom, #d4af37 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-amber-500 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <img src={bravoLogo} alt="BRAVOCARS" className="h-12 w-auto" />
            <span className="text-3xl font-bold text-amber-500">BRAVOCARS</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue bidding on luxury cars</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-8 mb-6">
          <form onSubmit={handleSignIn} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@email.com"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500 mt-2"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Link to="/forgot-password" className="text-amber-500 text-sm hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-6 text-lg"
            >
              {isLoggingIn ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Register Link */}
            <p className="text-center text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-amber-500 hover:underline font-semibold">
                Create Account
              </Link>
            </p>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
