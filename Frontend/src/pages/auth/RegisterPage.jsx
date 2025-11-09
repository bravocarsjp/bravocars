import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Gavel, ArrowLeft } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import bravoLogo from '../../assets/bravo-logo.png';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isRegistering } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    const result = await register(formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #d4af37 1px, transparent 1px), linear-gradient(to bottom, #d4af37 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="w-full max-w-2xl relative z-10">
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
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
          <p className="text-gray-400">Join the premier luxury car auction marketplace</p>
        </div>

        {/* Register Form */}
        <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-6">
                <h3 className="text-green-400 font-bold text-xl mb-2">Registration Successful!</h3>
                <p className="text-gray-400">Your account is pending admin approval. You'll be able to login once approved.</p>
              </div>
              <p className="text-gray-400 text-sm">Redirecting to login page...</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-300">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500 mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-300">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500 mt-2"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500 mt-2"
                  required
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password" className="text-gray-300">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500 mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="bg-zinc-800 border-amber-500/20 text-white placeholder:text-gray-500 mt-2"
                    required
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 bg-zinc-800 border-amber-500/20 rounded"
                  required
                />
                <label htmlFor="terms" className="text-gray-400 text-sm">
                  I agree to the <Link to="/terms" className="text-amber-500 hover:underline">Terms of Service</Link> and{' '}
                  <Link to="/privacy" className="text-amber-500 hover:underline">Privacy Policy</Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isRegistering}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-6 text-lg"
              >
                {isRegistering ? 'Creating Account...' : 'Create Account'}
              </Button>

              {/* Sign In Link */}
              <p className="text-center text-gray-400 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-amber-500 hover:underline font-semibold">
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
