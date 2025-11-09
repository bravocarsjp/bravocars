import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { mockBidActivity } from '../../data/adminMockData';

export const BiddingActivity = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Bidding <span className="text-amber-500">Activity</span></h1>
        <p className="text-gray-400">Monitor real-time bidding activity and analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-10 h-10 text-amber-500" />
            <span className="text-green-500 text-sm font-semibold">+15%</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">1,247</div>
          <div className="text-gray-400 text-sm">Total Bids Today</div>
        </div>

        <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-10 h-10 text-blue-500" />
            <span className="text-green-500 text-sm font-semibold">+8%</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">$12.4M</div>
          <div className="text-gray-400 text-sm">Total Bid Volume</div>
        </div>

        <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-10 h-10 text-purple-500" />
            <span className="text-green-500 text-sm font-semibold">+22%</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">$185K</div>
          <div className="text-gray-400 text-sm">Average Bid Value</div>
        </div>
      </div>

      {/* Recent Bids */}
      <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Bids</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-amber-500/20">
              <tr>
                <th className="text-left text-gray-400 font-semibold px-4 py-3">User</th>
                <th className="text-left text-gray-400 font-semibold px-4 py-3">Auction</th>
                <th className="text-left text-gray-400 font-semibold px-4 py-3">Bid Amount</th>
                <th className="text-left text-gray-400 font-semibold px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {mockBidActivity.map((bid) => (
                <tr key={bid.id} className="border-b border-amber-500/10 hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-4 text-white">{bid.user}</td>
                  <td className="px-4 py-4 text-gray-300">{bid.auction}</td>
                  <td className="px-4 py-4 text-amber-500 font-bold">${bid.bidAmount.toLocaleString()}</td>
                  <td className="px-4 py-4 text-gray-400 text-sm">{bid.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
