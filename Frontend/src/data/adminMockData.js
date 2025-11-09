// Mock data for admin dashboard when real data is not available

export const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'buyer', status: 'active', totalBids: 15, totalSpent: 450000, joinedDate: '2024-01-15' },
  { id: 2, name: 'Sarah Williams', email: 'sarah@example.com', role: 'seller', status: 'active', totalListings: 8, totalRevenue: 1250000, joinedDate: '2024-02-20' },
  { id: 3, name: 'Michael Chen', email: 'michael@example.com', role: 'buyer', status: 'active', totalBids: 23, totalSpent: 780000, joinedDate: '2024-03-10' },
  { id: 4, name: 'Emma Davis', email: 'emma@example.com', role: 'seller', status: 'pending', totalListings: 4, totalRevenue: 620000, joinedDate: '2024-11-01' },
  { id: 5, name: 'James Wilson', email: 'james@example.com', role: 'buyer', status: 'blocked', totalBids: 5, totalSpent: 120000, joinedDate: '2024-10-05' },
];

export const mockAuctions = [
  { id: 1, name: '2023 Ferrari 488 GTB', year: 2023, mileage: '2,450', currentBid: 285000, finalBid: null, bids: 12, status: 'active', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=100' },
  { id: 2, name: '2022 Porsche 911 Turbo S', year: 2022, mileage: '5,120', currentBid: 195000, finalBid: null, bids: 8, status: 'active', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=100' },
  { id: 3, name: '2021 Lamborghini Huracan', year: 2021, mileage: '8,900', currentBid: null, finalBid: 245000, bids: 15, status: 'sold', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=100' },
];

export const mockBiddingActivity = [
  { id: 1, user: 'John Doe', auction: '2023 Ferrari 488 GTB', amount: 285000, time: '2 minutes ago', status: 'leading' },
  { id: 2, user: 'Michael Chen', auction: '2022 Porsche 911 Turbo S', amount: 195000, time: '15 minutes ago', status: 'leading' },
  { id: 3, user: 'Sarah Williams', auction: '2023 Ferrari 488 GTB', amount: 280000, time: '1 hour ago', status: 'outbid' },
];

export const mockPendingApprovals = [
  { id: 1, type: 'user', name: 'Emma Davis', email: 'emma@example.com', submittedDate: '2024-11-08', status: 'pending' },
  { id: 2, type: 'auction', name: '2024 McLaren 720S', year: 2024, mileage: '1,200', reservePrice: 320000, seller: 'Sarah Williams', submittedDate: '2024-11-07', status: 'pending', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400' },
  { id: 3, type: 'auction', name: '2023 Aston Martin DB11', year: 2023, mileage: '3,500', reservePrice: 225000, seller: 'John Peterson', submittedDate: '2024-11-06', status: 'pending', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400' },
];

export const mockBidActivity = [
  { id: 1, user: 'John Doe', auction: '2023 Ferrari 488 GTB', bidAmount: 285000, timestamp: '2 minutes ago' },
  { id: 2, user: 'Michael Chen', auction: '2022 Porsche 911 Turbo S', bidAmount: 195000, timestamp: '15 minutes ago' },
  { id: 3, user: 'Sarah Williams', auction: '2023 Ferrari 488 GTB', bidAmount: 280000, timestamp: '1 hour ago' },
  { id: 4, user: 'James Wilson', auction: '2021 Lamborghini Huracan', bidAmount: 245000, timestamp: '2 hours ago' },
  { id: 5, user: 'Emma Davis', auction: '2022 Porsche 911 Turbo S', bidAmount: 190000, timestamp: '3 hours ago' },
];
