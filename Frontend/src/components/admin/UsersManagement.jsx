import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Ban, CheckCircle, Mail } from 'lucide-react';
import { mockUsers } from '../../data/adminMockData';

export const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || user.role === filter || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    alert(`${user.name} has been ${newStatus === 'blocked' ? 'blocked' : 'activated'}.`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Users <span className="text-amber-500">Management</span></h1>
        <p className="text-gray-400">Manage buyers, sellers, and user accounts</p>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-800 border-amber-500/20 text-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'buyer', 'seller', 'active', 'blocked'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                onClick={() => setFilter(status)}
                className={filter === status ? 'bg-amber-500 text-black text-xs' : 'border-amber-500/30 text-gray-400 text-xs'}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-zinc-900 border border-amber-500/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-950 border-b border-amber-500/20">
              <tr>
                <th className="text-left text-gray-400 font-semibold px-6 py-4">User</th>
                <th className="text-left text-gray-400 font-semibold px-6 py-4">Role</th>
                <th className="text-left text-gray-400 font-semibold px-6 py-4">Status</th>
                <th className="text-left text-gray-400 font-semibold px-6 py-4">Activity</th>
                <th className="text-left text-gray-400 font-semibold px-6 py-4">Joined</th>
                <th className="text-right text-gray-400 font-semibold px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-amber-500/10 hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white font-semibold">{user.name}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'buyer' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active' ? 'bg-green-500/10 text-green-500' :
                      user.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'buyer' ? (
                      <div>
                        <div className="text-white text-sm">{user.totalBids} bids</div>
                        <div className="text-gray-400 text-xs">${(user.totalSpent / 1000).toFixed(0)}K spent</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-white text-sm">{user.totalListings} listings</div>
                        <div className="text-gray-400 text-xs">${(user.totalRevenue / 1000).toFixed(0)}K revenue</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{user.joinedDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="Send Email">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`p-2 transition-colors ${
                          user.status === 'active'
                            ? 'text-gray-400 hover:text-red-500'
                            : 'text-gray-400 hover:text-green-500'
                        }`}
                        title={user.status === 'active' ? 'Block User' : 'Activate User'}
                      >
                        {user.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
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
