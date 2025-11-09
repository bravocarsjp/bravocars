import React from 'react';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { mockPendingApprovals } from '../../data/adminMockData';

export const PendingApprovals = () => {
  const handleApprove = (item) => {
    alert(`${item.name} has been approved and will go live soon.`);
  };

  const handleReject = (item) => {
    alert(`${item.name} has been rejected.`);
  };

  const pendingAuctions = mockPendingApprovals.filter(item => item.type === 'auction');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Pending <span className="text-amber-500">Approvals</span></h1>
        <p className="text-gray-400">Review and approve new auction listings</p>
      </div>

      {/* Pending Count */}
      <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-400 mb-1">Pending Listings</div>
            <div className="text-3xl font-bold text-white">{pendingAuctions.length}</div>
          </div>
          <div className="text-yellow-500 text-sm font-semibold">Requires Review</div>
        </div>
      </div>

      {/* Pending Auctions */}
      <div className="space-y-6">
        {pendingAuctions.map((auction) => (
          <div key={auction.id} className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 hover:border-amber-500/40 transition-all">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Image */}
              <img
                src={auction.image}
                alt={auction.name}
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />

              {/* Details */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{auction.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-gray-400">Year</div>
                    <div className="text-white font-semibold">{auction.year}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Mileage</div>
                    <div className="text-white font-semibold">{auction.mileage} mi</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Reserve Price</div>
                    <div className="text-amber-500 font-bold">${auction.reservePrice.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Seller</div>
                    <div className="text-white font-semibold">{auction.seller}</div>
                  </div>
                </div>
                <div className="mt-3 text-gray-500 text-xs">Submitted {auction.submittedDate}</div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                <Button
                  onClick={() => handleApprove(auction)}
                  className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(auction)}
                  variant="outline"
                  className="flex-1 md:flex-none border-red-500/30 text-red-500 hover:bg-red-500/10"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
