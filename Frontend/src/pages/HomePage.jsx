import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { Hero } from '../components/Hero';
import { AuctionCard } from '../components/AuctionCard';
import auctionService from '../services/auctionService';
import SkeletonCard from '../components/SkeletonCard';
import SEO from '../components/SEO';

const HomePage = () => {
  const navigate = useNavigate();
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [finishedAuctions, setFinishedAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load active auctions
      const activeResult = await auctionService.getAuctions({
        pageNumber: 1,
        pageSize: 9,
        status: 'Active',
      });

      // Load completed auctions
      const completedResult = await auctionService.getAuctions({
        pageNumber: 1,
        pageSize: 3,
        status: 'Completed',
      });

      if (activeResult.success) {
        setLiveAuctions(activeResult.data.items || []);
      } else {
        setError(activeResult.message || 'Failed to load auctions');
      }

      if (completedResult.success) {
        setFinishedAuctions(completedResult.data.items || []);
      }
    } catch (err) {
      console.error('Error loading auctions:', err);
      setError('Unable to load auctions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* SEO Meta Tags */}
      <SEO
        title="BRAVOCARS - Premium Luxury Car Auctions"
        description="Japan's most prestigious marketplace for luxury and exotic vehicles. Join thousands of collectors, enthusiasts, and dealers in the ultimate car auction experience."
      />

      {/* Hero Section */}
      <Hero />

      {/* Error State */}
      {error && !loading && (
        <section className="py-20 bg-zinc-950 relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center py-12 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-lg mb-6">{error}</p>
              <Button
                onClick={loadAuctions}
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold group"
              >
                <RefreshCw className="mr-2 w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                Try Again
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && (
        <section className="py-20 bg-zinc-950 relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-12">
              <div className="h-12 bg-zinc-800 rounded w-64 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-zinc-800 rounded w-96 mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Live Auctions Section */}
      {!loading && !error && (
        <section className="py-20 bg-zinc-950 relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

          <div className="container mx-auto max-w-7xl px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Live Auctions
              </h2>
              <p className="text-gray-400 text-lg">
                {liveAuctions.length > 0
                  ? `${liveAuctions.length} active auctions - Place your bids now!`
                  : 'No active auctions at the moment'}
              </p>
            </div>

            {/* Cards Grid - 3x3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {liveAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} isFinished={false} />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Button
                onClick={() => navigate('/auctions')}
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8 py-6 text-lg group"
              >
                View All Auctions
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Finished Auctions Section */}
      {!loading && !error && finishedAuctions.length > 0 && (
        <section className="py-20 bg-black relative">
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

          <div className="container mx-auto max-w-7xl px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Recently Completed
              </h2>
              <p className="text-gray-400 text-lg">
                Check out recently sold vehicles
              </p>
            </div>

            {/* Cards Grid - 1x3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {finishedAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} isFinished={true} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
