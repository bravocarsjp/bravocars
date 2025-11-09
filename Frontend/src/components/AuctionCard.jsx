import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Clock, Gavel, TrendingUp } from 'lucide-react';

export const AuctionCard = ({ auction, isFinished = false }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Dummy/placeholder images for luxury cars
  const dummyImages = [
    'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&h=600&fit=crop', // Mercedes
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=600&fit=crop', // Ferrari
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop', // Porsche
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop', // Lamborghini
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop', // BMW
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', // Aston Martin
  ];

  // Use auction.image if available, otherwise use a random dummy image based on auction ID
  const getImage = () => {
    if (auction.image) return auction.image;
    const index = auction.id ? auction.id % dummyImages.length : Math.floor(Math.random() * dummyImages.length);
    return dummyImages[index];
  };

  return (
    <div className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 cursor-pointer hover:-translate-y-2">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-zinc-800">
        <img
          src={getImage()}
          alt={auction.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={(e) => {
            // Fallback to first dummy image if image fails to load
            e.target.src = dummyImages[0];
          }}
        />
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          {!isFinished ? (
            <span className="px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md bg-green-600/80 text-white border-green-500 shadow-lg shadow-green-500/50 animate-pulse">
              🔴 LIVE
            </span>
          ) : (
            <span className="px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md bg-zinc-800/80 text-gray-300 border-zinc-700 shadow-lg">
              SOLD
            </span>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors duration-300 line-clamp-1">
          {auction.name}
        </h3>

        {/* Price Highlight */}
        <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Gavel className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                  {!isFinished ? 'Current Bid' : 'Sold For'}
                </div>
                <div className="text-xl font-bold text-white">
                  {formatPrice(!isFinished ? (auction.currentBid || auction.startingPrice || 0) : (auction.finalBid || 0))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 py-1">
          {/* Bid Count */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Total Bids</div>
              <div className="text-base font-bold text-white">{auction.bids || 0}</div>
            </div>
          </div>

          {/* Year */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Year</div>
              <div className="text-base font-bold text-white">{auction.car?.year || auction.year || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Timer */}
        {!isFinished && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">Time Remaining</div>
                <div className="text-base font-bold text-white font-mono">23h 59m 59s</div>
              </div>
            </div>
          </div>
        )}

        {/* View Details Button */}
        <div className="pt-2 border-t border-zinc-800/50">
          <Link
            to={`/auctions/${auction.id}`}
            className="inline-flex items-center justify-center w-full bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black font-bold py-2.5 px-4 rounded-xl border border-amber-500/30 hover:border-amber-500 transition-all duration-300 group/btn"
          >
            View Details
            <svg
              className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
