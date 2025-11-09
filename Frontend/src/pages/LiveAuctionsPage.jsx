import { useState, useEffect } from 'react';
import { AuctionCard } from '../components/AuctionCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, SlidersHorizontal, RefreshCw, Car } from 'lucide-react';
import auctionService from '../services/auctionService';
import SkeletonCard from '../components/SkeletonCard';
import SEO from '../components/SEO';

const LiveAuctionsPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await auctionService.getAuctions({
        pageNumber: 1,
        pageSize: 100,
        status: 'Active',
      });

      if (result.success) {
        setAuctions(result.data.items || []);
      } else {
        setError(result.message || 'Failed to load auctions');
      }
    } catch (err) {
      console.error('Error loading auctions:', err);
      setError('Unable to load auctions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAuctions = auctions
    .filter(auction => {
      const carTitle = `${auction.car?.year} ${auction.car?.make} ${auction.car?.model}`.toLowerCase();
      const matchesSearch = carTitle.includes(searchTerm.toLowerCase()) ||
                           auction.title?.toLowerCase().includes(searchTerm.toLowerCase());

      const currentPrice = auction.currentBid || auction.startingPrice || 0;
      let matchesPrice = true;

      if (priceRange === 'under-100k') matchesPrice = currentPrice < 100000;
      if (priceRange === '100k-200k') matchesPrice = currentPrice >= 100000 && currentPrice < 200000;
      if (priceRange === 'over-200k') matchesPrice = currentPrice >= 200000;

      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'ending-soon') {
        return new Date(a.endTime) - new Date(b.endTime);
      }
      if (sortBy === 'price-low') {
        return (a.currentBid || a.startingPrice) - (b.currentBid || b.startingPrice);
      }
      if (sortBy === 'price-high') {
        return (b.currentBid || b.startingPrice) - (a.currentBid || a.startingPrice);
      }
      if (sortBy === 'most-bids') {
        return (b.bidCount || 0) - (a.bidCount || 0);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-black">
      {/* SEO Meta Tags */}
      <SEO
        title="Live Auctions - BRAVOCARS"
        description={`Browse ${filteredAuctions.length} live luxury car auctions. Find your dream vehicle from our exclusive collection of verified listings.`}
      />

      {/* Page Header */}
      <section className="pt-32 pb-12 bg-black">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Live <span className="text-amber-500">Auctions</span>
          </h1>
          <p className="text-gray-400 text-lg">Browse and bid on exclusive luxury vehicles</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-zinc-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by car name or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-900 border-amber-500/20 text-white placeholder:text-gray-500"
              />
            </div>

            {/* Price Range */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="bg-zinc-900 border-amber-500/20 text-white">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-100k">Under $100K</SelectItem>
                <SelectItem value="100k-200k">$100K - $200K</SelectItem>
                <SelectItem value="over-200k">Over $200K</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-zinc-900 border-amber-500/20 text-white">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="most-bids">Most Bids</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing <span className="text-amber-500 font-semibold">{filteredAuctions.length}</span> live auctions
            </p>
            <Button variant="outline" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && !loading && (
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center py-12 bg-red-500/10 border border-red-500/30 rounded-xl max-w-2xl mx-auto">
              <p className="text-red-400 text-xl mb-6">{error}</p>
              <Button onClick={loadAuctions} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold group">
                <RefreshCw className="mr-2 w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                Try Again
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAuctions.length === 0 && (
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center py-20 max-w-2xl mx-auto">
              <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-12">
                <Car className="w-20 h-20 text-amber-500 mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-bold text-white mb-4">No Auctions Found</h3>
                <p className="text-gray-400 mb-8">
                  {searchTerm || priceRange !== 'all'
                    ? 'No auctions match your current filters. Try adjusting your search criteria.'
                    : 'There are no active auctions at the moment. Check back soon for new listings!'}
                </p>
                {(searchTerm || priceRange !== 'all') && (
                  <Button
                    onClick={() => { setSearchTerm(''); setPriceRange('all'); }}
                    variant="outline"
                    className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Auctions Grid */}
      {!loading && !error && filteredAuctions.length > 0 && (
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} isFinished={false} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LiveAuctionsPage;
