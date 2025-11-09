import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DollarSign, TrendingUp, Users, Car, ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle, CheckCircle, Clock, Activity, Gavel, ShoppingCart } from 'lucide-react';

export const DashboardOverview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data - will be replaced with real API calls
  const mockUsers = [
    { id: 1, status: 'active' },
    { id: 2, status: 'active' },
    { id: 3, status: 'active' },
    { id: 4, status: 'pending' },
    { id: 5, status: 'active' },
  ];

  const liveAuctions = [
    { id: 1, status: 'active' },
    { id: 2, status: 'active' },
    { id: 3, status: 'active' },
  ];

  // Simulate data fetching
  const loadDashboardData = () => {
    setLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Monthly data for charts
  const monthlyData = [
    { month: 'Jan', auctions: 12, bids: 245, revenue: 45000 },
    { month: 'Feb', auctions: 15, bids: 298, revenue: 52000 },
    { month: 'Mar', auctions: 18, bids: 356, revenue: 61000 },
    { month: 'Apr', auctions: 22, bids: 412, revenue: 71000 },
    { month: 'May', auctions: 25, bids: 478, revenue: 82000 },
    { month: 'Jun', auctions: 28, bids: 534, revenue: 95000 },
  ];

  // Auction distribution data
  const auctionStatusData = [
    { name: 'Active', value: liveAuctions.filter(a => a.status === 'active').length, color: '#10b981' },
    { name: 'Scheduled', value: 5, color: '#3b82f6' },
    { name: 'Completed', value: 28, color: '#8b5cf6' },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6'];

  // Metric Card Component matching BravoCar exactly
  const MetricCard = ({ title, value, subtitle, icon: Icon, iconColor, trend }) => (
    <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 hover:border-amber-500/40 transition-all relative overflow-hidden group">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, ${iconColor} 1px, transparent 1px), linear-gradient(to bottom, ${iconColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${iconColor}20` }}>
            <Icon className="w-6 h-6" style={{ color: iconColor }} />
          </div>
          {trend && (
            <div className="flex items-center space-x-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{trend}</span>
            </div>
          )}
        </div>

        <div className="mb-2">
          <div className="text-gray-400 text-sm mb-1">{title}</div>
          <div className="text-white text-3xl font-bold">{value}</div>
        </div>

        <div className="text-gray-500 text-xs">{subtitle}</div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="max-w-md w-full">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-red-400 text-xl font-semibold mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={loadDashboardData}
              className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors group"
            >
              <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Refresh Button - Exact BravoCar spacing */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold text-white">
            Dashboard <span className="text-amber-500">Overview</span>
          </h1>
          <button
            onClick={loadDashboardData}
            className="inline-flex items-center px-4 py-2 border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors group"
          >
            <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            Refresh
          </button>
        </div>
        <p className="text-gray-400">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Metric Cards - Exact BravoCar grid and spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Users"
          value={mockUsers.length}
          subtitle={`${mockUsers.filter(u => u.status === 'active').length} active users`}
          icon={Users}
          iconColor="#f59e0b"
          trend="+12%"
        />
        <MetricCard
          title="Active Auctions"
          value={liveAuctions.filter(a => a.status === 'active').length}
          subtitle="Currently running"
          icon={Gavel}
          iconColor="#10b981"
          trend="+8%"
        />
        <MetricCard
          title="Total Revenue"
          value="$1.4M"
          subtitle="All time"
          icon={DollarSign}
          iconColor="#3b82f6"
          trend="+23%"
        />
        <MetricCard
          title="Total Bids"
          value="788"
          subtitle="Platform wide"
          icon={ShoppingCart}
          iconColor="#8b5cf6"
          trend="+15%"
        />
      </div>

      {/* Charts Section - Exact BravoCar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Trend Chart - BravoCar styling */}
        <div className="lg:col-span-2 bg-zinc-900 border border-amber-500/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-2">Revenue & Auction Trends</h2>
          <p className="text-gray-400 text-sm mb-6">Monthly performance overview</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis yAxisId="left" stroke="#9ca3af" />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #f59e0b', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                strokeWidth={3}
                name="Revenue ($)"
                dot={{ fill: '#f59e0b' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="auctions"
                stroke="#10b981"
                strokeWidth={3}
                name="Auctions"
                dot={{ fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Auction Status Distribution - BravoCar styling */}
        <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-2">Auction Distribution</h2>
          <p className="text-gray-400 text-sm mb-6">By status</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={auctionStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {auctionStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #f59e0b', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bidding Activity Chart - BravoCar styling */}
      <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-2">Bidding Activity</h2>
        <p className="text-gray-400 text-sm mb-6">Monthly bid volume</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #f59e0b', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="bids" fill="#f59e0b" name="Total Bids" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats Cards - Exact BravoCar spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-amber-500/10 rounded-lg mx-auto mb-4">
            <Clock className="w-6 h-6 text-amber-500" />
          </div>
          <div className="text-gray-400 text-sm mb-2">Pending Approvals</div>
          <div className="text-amber-500 text-3xl font-bold mb-2">12</div>
          <div className="text-gray-500 text-xs">Awaiting review</div>
        </div>

        <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-lg mx-auto mb-4">
            <Activity className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-gray-400 text-sm mb-2">Avg Bids/Auction</div>
          <div className="text-blue-500 text-3xl font-bold mb-2">24.5</div>
          <div className="text-gray-500 text-xs">Platform average</div>
        </div>

        <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-lg mx-auto mb-4">
            <Users className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-gray-400 text-sm mb-2">New Today</div>
          <div className="text-green-500 text-3xl font-bold mb-2">8</div>
          <div className="text-gray-500 text-xs">Registered today</div>
        </div>

        <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-lg mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-gray-400 text-sm mb-2">Completion Rate</div>
          <div className="text-purple-500 text-3xl font-bold mb-2">94%</div>
          <div className="text-gray-500 text-xs">Successful auctions</div>
        </div>
      </div>
    </div>
  );
};
