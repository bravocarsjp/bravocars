import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, TrendingUp, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroNew = ({ stats }) => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden bg-black pt-20 md:pt-24 pb-12 md:pb-16">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, #d4af37 1px, transparent 1px), linear-gradient(to bottom, #d4af37 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <span className="text-amber-500 text-sm font-medium">Premium Car Auctions</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="text-white">Bid on </span>
            <span className="text-amber-500">Luxury</span>
            <br />
            <span className="text-white">Drive </span>
            <span className="text-amber-500">Excellence</span>
          </h1>

          {/* Subheadline */}
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
            The world's most prestigious marketplace for luxury and exotic vehicles.
            Join thousands of collectors, enthusiasts, and dealers in the ultimate car auction experience.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              onClick={() => navigate('/auctions')}
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8 py-6 text-lg group"
            >
              Browse Auctions
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => navigate('/sell')}
              variant="outline"
              className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10 px-8 py-6 text-lg"
            >
              Sell Your Car
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-amber-500/20 rounded-xl p-6 hover:border-amber-500/40 transition-all">
              <Shield className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400 text-sm">Verified Listings</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-amber-500/20 rounded-xl p-6 hover:border-amber-500/40 transition-all">
              <Clock className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">{stats?.activeBids || '24/7'}</div>
              <div className="text-gray-400 text-sm">Live Auctions</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-amber-500/20 rounded-xl p-6 hover:border-amber-500/40 transition-all">
              <TrendingUp className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">${stats?.totalValue || '2B+'}</div>
              <div className="text-gray-400 text-sm">Total Sales</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
};
