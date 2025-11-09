import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

// Dummy car image for auctions without pictures
const DUMMY_CAR_IMAGE = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop';

export default function AuctionCardNew({ auction }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    // Handle both string and enum (number) status values
    const statusStr = typeof status === 'string' ? status.toLowerCase() : '';

    switch (statusStr) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status) => {
    // Handle both string and enum (number) status values
    if (typeof status === 'string') return status;

    // Map enum values to strings (based on AuctionStatus enum in backend)
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
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleCardClick = () => {
    navigate(`/auctions/${auction.id}`);
  };

  // Get image URL (use first image or dummy car image)
  const imageUrl = auction.car?.imageUrls?.[0] || DUMMY_CAR_IMAGE;
  const carTitle = `${auction.car?.year || ''} ${auction.car?.make || ''} ${auction.car?.model || ''}`.trim() || 'Vehicle';

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`View auction details for ${carTitle}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-zinc-800">
        <img
          src={imageUrl}
          alt={carTitle}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = DUMMY_CAR_IMAGE;
          }}
        />

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm',
              getStatusColor(getStatusText(auction.status))
            )}
          >
            {getStatusText(auction.status)}
          </span>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors line-clamp-1">
          {carTitle}
        </h3>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {/* Current Bid */}
          <div className="flex items-center gap-2 text-zinc-400">
            <DollarSign className="w-4 h-4 text-amber-500" />
            <div>
              <div className="text-xs">Current Bid</div>
              <div className="text-white font-semibold">
                {formatPrice(auction.currentBid || auction.car?.startingPrice)}
              </div>
            </div>
          </div>

          {/* Bid Count */}
          <div className="flex items-center gap-2 text-zinc-400">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <div>
              <div className="text-xs">Bids</div>
              <div className="text-white font-semibold">
                {auction.bidCount || 0}
              </div>
            </div>
          </div>

          {/* Start Date */}
          <div className="flex items-center gap-2 text-zinc-400">
            <Calendar className="w-4 h-4 text-amber-500" />
            <div>
              <div className="text-xs">Starts</div>
              <div className="text-white font-semibold text-xs">
                {formatDate(auction.startTime)}
              </div>
            </div>
          </div>

          {/* End Date */}
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock className="w-4 h-4 text-amber-500" />
            <div>
              <div className="text-xs">Ends</div>
              <div className="text-white font-semibold text-xs">
                {formatDate(auction.endTime)}
              </div>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <div className="pt-2 border-t border-zinc-800">
          <span className="text-amber-500 text-sm font-semibold group-hover:text-amber-400 inline-flex items-center gap-2">
            View Details
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
