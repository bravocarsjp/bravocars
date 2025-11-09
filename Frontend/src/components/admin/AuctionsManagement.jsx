import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { mockAuctions } from '../../data/adminMockData';

export const AuctionsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredAuctions = mockAuctions.filter(auction => {
    const matchesSearch = auction.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || auction.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id) => {
    alert("Auction has been removed from the system.");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Auctions <span className="text-amber-500">Management</span></h1>
          <p className="text-gray-400">Create, edit, and manage all auctions</p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold">
          <Plus className="w-4 h-4 mr-2" />
          Create Auction
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-800 border-amber-500/20 text-white"
            />
          </div>
          <div className="flex space-x-2">
            {['all', 'active', 'sold'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                onClick={() => setFilter(status)}
                className={filter === status ? 'bg-amber-500 text-black' : 'border-amber-500/30 text-gray-400'}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Auctions Table */}
      <div className="bg-zinc-900 border border-amber-500/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-950 border-b border-amber-500/20">
              <tr>
                <th className="text-left text-gray-400 font-semibold px-6 py-4">Vehicle</th>
                <th className="text-left text-gray-400 font-semibold px-6 py-4">Status</th>
                <th className="text-left text-gray-400 font-semibold px-6 py-4">Year</th>
                <th className="text-left text-gray-400 font-semibold px-6 py-4">Current/Final Bid</th>
                <th className="text-left text-gray-400 font-semibold px-6 py-4">Bids</th>
                <th className="text-right text-gray-400 font-semibold px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuctions.map((auction) => (
                <tr key={auction.id} className="border-b border-amber-500/10 hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={auction.image} alt={auction.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <div className="text-white font-semibold">{auction.name}</div>
                        <div className="text-gray-400 text-sm">{auction.mileage} miles</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      auction.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {auction.status === 'active' ? 'Active' : 'Sold'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{auction.year}</td>
                  <td className="px-6 py-4 text-amber-500 font-bold">
                    ${(auction.currentBid || auction.finalBid).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{auction.bids || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-amber-500 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(auction.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
