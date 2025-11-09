import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Clock, Gavel, TrendingUp, MapPin, Calendar, Gauge, Fuel, Settings, Award, Shield, WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import auctionService from '../services/auctionService';
import bidService from '../services/bidService';
import { signalRService } from '../services/signalRService';
import useAuthStore from '../stores/authStore';
import CountdownTimerNew from '../components/auction/CountdownTimerNew';
import SEO from '../components/SEO';

// Dummy car image for auctions without pictures
const DUMMY_CAR_IMAGE = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!user;

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [bids, setBids] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [placingBid, setPlacingBid] = useState(false);
  const [totalBids, setTotalBids] = useState(0);

  useEffect(() => {
    loadAuction();
    loadBids();

    // Connect to SignalR and join auction room
    const initializeSignalR = async () => {
      if (isAuthenticated) {
        const connected = await signalRService.connect();
        if (connected) {
          setIsConnected(true);
          await signalRService.joinAuction(Number(id));
        }
      }
    };

    initializeSignalR();

    // Subscribe to real-time events
    const unsubscribeBidPlaced = signalRService.on('bidPlaced', handleBidPlaced);
    const unsubscribeStatusChanged = signalRService.on('auctionStatusChanged', handleStatusChanged);
    const unsubscribeAuctionEnded = signalRService.on('auctionEnded', handleAuctionEnded);
    const unsubscribeReconnected = signalRService.on('reconnected', handleReconnected);
    const unsubscribeConnectionClosed = signalRService.on('connectionClosed', handleConnectionClosed);

    // Cleanup on unmount
    return () => {
      unsubscribeBidPlaced();
      unsubscribeStatusChanged();
      unsubscribeAuctionEnded();
      unsubscribeReconnected();
      unsubscribeConnectionClosed();

      if (isAuthenticated) {
        signalRService.leaveAuction(Number(id));
      }
    };
  }, [id, isAuthenticated]);

  const loadAuction = async () => {
    try {
      setLoading(true);
      const result = await auctionService.getAuctionById(id);
      if (result.success) {
        setAuction(result.data);
        setBidAmount(result.data.currentPrice + 100);
      } else {
        setError(result.message || 'Failed to load auction');
      }
    } catch (err) {
      setError('Unable to load auction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadBids = async () => {
    try {
      const result = await bidService.getBidsByAuctionId(id);
      if (result.success) {
        setBids(result.data || []);
        setTotalBids(result.data?.length || 0);
      }
    } catch (err) {
      console.error('Error loading bids:', err);
    }
  };

  // SignalR event handlers
  const handleBidPlaced = (bidInfo) => {
    console.log('New bid received:', bidInfo);

    // Update auction current price
    setAuction((prev) => ({
      ...prev,
      currentPrice: bidInfo.bidAmount,
    }));

    // Update minimum bid amount
    setBidAmount(bidInfo.bidAmount + 100);

    // Update total bids count
    setTotalBids(bidInfo.totalBids || totalBids + 1);

    // Reload bids to show in history
    loadBids();
  };

  const handleStatusChanged = (statusInfo) => {
    console.log('Auction status changed:', statusInfo);
    setAuction((prev) => ({
      ...prev,
      status: statusInfo.status,
    }));
  };

  const handleAuctionEnded = (auctionEndInfo) => {
    console.log('Auction ended:', auctionEndInfo);
    setAuction((prev) => ({
      ...prev,
      status: 'Completed',
    }));
    loadAuction(); // Reload to get final state
  };

  const handleReconnected = () => {
    console.log('SignalR reconnected');
    setIsConnected(true);
    loadAuction(); // Reload data after reconnection
    loadBids();
  };

  const handleConnectionClosed = () => {
    console.log('SignalR connection closed');
    setIsConnected(false);
  };

  const handlePlaceBid = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const bidAmountNum = parseFloat(bidAmount);
    if (!bidAmountNum || bidAmountNum <= auction.currentPrice) {
      return;
    }

    try {
      setPlacingBid(true);
      const result = await bidService.placeBid(Number(id), bidAmountNum);

      if (!result.success) {
        console.error('Failed to place bid:', result.message);
      }
      // The real-time update will handle UI changes via SignalR
    } catch (err) {
      console.error('Error placing bid:', err);
    } finally {
      setPlacingBid(false);
    }
  };

  const getStatusText = (status) => {
    if (typeof status === 'string') return status;
    const statusMap = {
      0: 'Draft',
      1: 'Scheduled',
      2: 'Active',
      3: 'Completed',
      4: 'Cancelled'
    };
    return statusMap[status] || 'Unknown';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-12">
            <p className="text-red-400 text-xl mb-6">{error || 'Auction not found'}</p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={loadAuction}
                variant="outline"
                className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10 group"
              >
                <RefreshCw className="mr-2 w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                Retry
              </Button>
              <Button onClick={() => navigate('/auctions')} className="bg-amber-500 hover:bg-amber-400 text-black">
                Back to Auctions
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const car = auction.car || {};
  const statusText = getStatusText(auction.status);
  const carImage = car.imageUrls?.[selectedImage] || DUMMY_CAR_IMAGE;
  const carName = `${car.year || ''} ${car.make || ''} ${car.model || ''}`.trim() || 'Luxury Vehicle';

  const specs = [
    { icon: Calendar, label: 'Year', value: car.year || 'N/A' },
    { icon: Gauge, label: 'Mileage', value: car.mileage ? `${car.mileage.toLocaleString()} miles` : 'N/A' },
    { icon: Settings, label: 'Transmission', value: car.transmission || 'Automatic' },
    { icon: Fuel, label: 'Fuel Type', value: car.fuelType || 'Gasoline' },
  ];

  const features = [
    'Premium Sound System', 'Leather Interior', 'Navigation System',
    'Backup Camera', 'Heated Seats', 'Sunroof', 'Alloy Wheels',
    'Cruise Control', 'Bluetooth Connectivity', 'LED Headlights'
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* SEO Meta Tags */}
      <SEO
        title={`${carName} - ${statusText} Auction`}
        description={`Bid on this ${carName}. Current bid: ${formatPrice(auction.currentPrice)}. ${car.description || `Premium ${carName} with ${car.mileage?.toLocaleString() || '0'} miles.`}`}
        image={carImage}
      />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image */}
              <div className="relative rounded-xl overflow-hidden mb-6">
                <img
                  src={carImage}
                  alt={carName}
                  className="w-full h-96 object-cover"
                />
                {statusText === 'Active' && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
                    LIVE AUCTION
                  </div>
                )}
                {isAuthenticated && (
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm flex items-center space-x-2">
                    {isConnected ? (
                      <>
                        <Wifi className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Live</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">Offline</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {car.imageUrls && car.imageUrls.length > 1 && (
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {car.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      src={url}
                      alt={`View ${index + 1} of ${carName}`}
                      className={`w-full h-24 object-cover cursor-pointer rounded-lg transition-all ${
                        selectedImage === index
                          ? 'ring-2 ring-amber-500 opacity-100'
                          : 'opacity-60 hover:opacity-80'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{carName}</h1>

              {/* Quick Stats */}
              <div className="flex items-center space-x-6 mb-8 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <CountdownTimerNew endTime={auction.endTime} status={statusText} />
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>{totalBids} bids</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location TBD</span>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Specifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {specs.map((spec, index) => {
                    const Icon = spec.icon;
                    return (
                      <div key={index}>
                        <Icon className="w-6 h-6 text-amber-500 mb-2" />
                        <div className="text-gray-400 text-sm">{spec.label}</div>
                        <div className="text-white font-semibold">{spec.value}</div>
                      </div>
                    );
                  })}
                </div>
                {car.vin && (
                  <div className="mt-6 pt-6 border-t border-amber-500/20">
                    <div className="text-gray-400 text-sm mb-1">VIN</div>
                    <div className="text-white font-mono">{car.vin}</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
                <p className="text-gray-400 leading-relaxed">
                  {car.description ||
                    `This stunning ${carName} represents the pinnacle of automotive excellence.
                    Meticulously maintained and featuring a comprehensive service history, this vehicle
                    offers an unparalleled driving experience. With only ${car.mileage?.toLocaleString() || '0'} miles on the odometer,
                    it presents an exceptional opportunity for discerning collectors and enthusiasts alike.`}
                </p>
              </div>

              {/* Features */}
              <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="text-gray-400 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bidding Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Current Bid */}
                <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 mb-6">
                  <div className="text-gray-400 text-sm mb-2">Current Bid</div>
                  <div className="text-amber-500 text-4xl font-bold mb-4">
                    {formatPrice(auction.currentPrice)}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                    <span>{totalBids} bids placed</span>
                    {statusText === 'Active' && (
                      <span className="text-red-500 font-semibold">
                        <CountdownTimerNew endTime={auction.endTime} status={statusText} />
                      </span>
                    )}
                  </div>

                  {statusText === 'Active' && (
                    <>
                      {/* Bid Input */}
                      <div className="mb-4">
                        <label className="text-gray-400 text-sm mb-2 block">Your Bid (USD)</label>
                        <Input
                          type="number"
                          placeholder={`Min: ${formatPrice(auction.currentPrice + 100)}`}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          className="bg-zinc-800 border-amber-500/20 text-white"
                        />
                      </div>

                      <Button
                        onClick={handlePlaceBid}
                        disabled={!isAuthenticated || parseFloat(bidAmount) <= auction.currentPrice || placingBid}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-6 mb-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Gavel className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                        {placingBid ? 'Placing Bid...' : 'Place Bid'}
                      </Button>

                      {!isAuthenticated ? (
                        <p className="text-gray-500 text-xs text-center">
                          Please login to place a bid
                        </p>
                      ) : (
                        <p className="text-gray-500 text-xs text-center">
                          By bidding, you agree to our terms and conditions
                        </p>
                      )}
                    </>
                  )}

                  {statusText === 'Completed' && (
                    <div className="bg-zinc-800 border border-amber-500/20 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm">This auction has ended</p>
                    </div>
                  )}

                  {statusText === 'Scheduled' && (
                    <div className="bg-zinc-800 border border-amber-500/20 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm">Auction starts on</p>
                      <p className="text-white font-semibold mt-1">
                        {format(new Date(auction.startTime), 'PPpp')}
                      </p>
                    </div>
                  )}

                  {/* Auction Times */}
                  <div className="mt-6 pt-6 border-t border-amber-500/20 space-y-3 text-sm">
                    <div>
                      <div className="text-gray-400 mb-1">Starting Price</div>
                      <div className="text-white font-semibold">{formatPrice(auction.startingPrice)}</div>
                    </div>
                    {auction.reservePrice && (
                      <div>
                        <div className="text-gray-400 mb-1">Reserve Price</div>
                        <div className="text-white font-semibold">{formatPrice(auction.reservePrice)}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-gray-400 mb-1">Start Time</div>
                      <div className="text-white">{format(new Date(auction.startTime), 'PPp')}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">End Time</div>
                      <div className="text-white">{format(new Date(auction.endTime), 'PPp')}</div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 mb-6">
                  <h3 className="text-white font-bold mb-4">Buyer Protection</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-amber-500 mt-0.5" />
                      <div>
                        <div className="text-white text-sm font-semibold">Verified Listing</div>
                        <div className="text-gray-400 text-xs">Inspected and authenticated</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-amber-500 mt-0.5" />
                      <div>
                        <div className="text-white text-sm font-semibold">Secure Payment</div>
                        <div className="text-gray-400 text-xs">Protected escrow service</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-amber-500 mt-0.5" />
                      <div>
                        <div className="text-white text-sm font-semibold">Return Policy</div>
                        <div className="text-gray-400 text-xs">7-day money back guarantee</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bid History */}
                {bids.length > 0 && (
                  <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6">
                    <h3 className="text-white font-bold mb-4">Bid History</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {bids.slice(0, 10).map((bid, index) => (
                        <div key={bid.id || index} className="flex justify-between items-start pb-3 border-b border-amber-500/10 last:border-0">
                          <div>
                            <div className="text-white font-semibold">{formatPrice(bid.amount)}</div>
                            <div className="text-gray-400 text-xs">
                              {bid.bidder?.firstName || 'Anonymous'}
                            </div>
                          </div>
                          <div className="text-gray-400 text-xs text-right">
                            {format(new Date(bid.placedAt), 'PPp')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
