import { Button } from '../components/ui/button';
import { UserPlus, Search, Gavel, Car, Shield, TrendingUp, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const HowItWorksPage = () => {
  const { isAuthenticated } = useAuth();
  const buyerSteps = [
    {
      icon: UserPlus,
      title: 'Create Account',
      description: 'Sign up for free and verify your identity to start bidding on luxury vehicles.'
    },
    {
      icon: Search,
      title: 'Browse Auctions',
      description: 'Explore our curated collection of luxury and exotic cars from verified sellers.'
    },
    {
      icon: Gavel,
      title: 'Place Your Bid',
      description: 'Bid confidently with transparent pricing and real-time auction updates.'
    },
    {
      icon: Award,
      title: 'Win & Drive',
      description: 'Win the auction, complete secure payment, and take delivery of your dream car.'
    }
  ];

  const sellerSteps = [
    {
      icon: UserPlus,
      title: 'Register as Seller',
      description: 'Create your seller account and get verified to list your luxury vehicle.'
    },
    {
      icon: Car,
      title: 'List Your Car',
      description: 'Submit detailed information, photos, and set your reserve price.'
    },
    {
      icon: Clock,
      title: 'Auction Goes Live',
      description: 'Your vehicle is showcased to thousands of potential buyers worldwide.'
    },
    {
      icon: TrendingUp,
      title: 'Get Paid',
      description: 'Receive payment securely once the auction ends and vehicle is transferred.'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'All payments are processed through our secure escrow system for buyer and seller protection.'
    },
    {
      icon: Award,
      title: 'Verified Listings',
      description: 'Every vehicle undergoes thorough inspection and verification before listing.'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our expert team is available around the clock to assist with any questions.'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #f59e0b 1px, transparent 1px), linear-gradient(to bottom, #f59e0b 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            How <span className="text-amber-500">BRAVOCARS</span> Works
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            The most transparent and secure way to buy and sell luxury vehicles
          </p>
        </div>
      </section>

      {/* For Buyers */}
      <section className="py-20 bg-zinc-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              For <span className="text-amber-500">Buyers</span>
            </h2>
            <p className="text-gray-400 text-lg">Your journey to owning a dream car</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {buyerSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 hover:border-amber-500/50 transition-all">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-amber-500" />
                    </div>
                    <div className="text-amber-500 font-bold text-sm mb-2">STEP {index + 1}</div>
                    <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {index < buyerSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-amber-500/30" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/auctions">
              <Button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8 py-6">
                Start Bidding Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Sellers */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              For <span className="text-amber-500">Sellers</span>
            </h2>
            <p className="text-gray-400 text-lg">Reach thousands of qualified buyers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sellerSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 hover:border-amber-500/50 transition-all">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-amber-500" />
                    </div>
                    <div className="text-amber-500 font-bold text-sm mb-2">STEP {index + 1}</div>
                    <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {index < sellerSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-amber-500/30" />
                  )}
                </div>
              );
            })}
          </div>

          {isAuthenticated && (
            <div className="text-center mt-12">
              <Link to="/sell">
                <Button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8 py-6">
                  List Your Car
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-zinc-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose <span className="text-amber-500">BRAVOCARS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-zinc-900 border border-amber-500/20 rounded-xl p-8 text-center hover:border-amber-500/50 transition-all">
                  <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10 text-amber-500" />
                  </div>
                  <h3 className="text-white font-bold text-2xl mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
