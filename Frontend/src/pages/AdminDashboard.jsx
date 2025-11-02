import { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Spin,
  Alert,
  Button,
  Statistic,
} from 'antd';
import {
  UserOutlined,
  AuditOutlined,
  DollarOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import adminService from '../services/adminService';

const { Title, Text, Paragraph } = Typography;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const result = await adminService.getDashboardStats();
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.message || 'Failed to load dashboard statistics');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('An error occurred while loading dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  // Modern Metric Card Component
  const MetricCard = ({ title, value, subtitle, icon: Icon, gradient, trend }) => (
    <Card
      style={{
        height: '100%',
        background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
      bodyStyle={{ position: 'relative', zIndex: 1 }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          transform: 'translate(50%, -50%)',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text style={{ opacity: 0.9, marginBottom: '8px', display: 'block', color: 'white' }}>
            {title}
          </Text>
          <Title level={2} style={{ fontWeight: 'bold', marginBottom: '8px', color: 'white' }}>
            {value}
          </Title>
          <Text style={{ opacity: 0.8, fontSize: '12px', color: 'white' }}>
            {subtitle}
          </Text>
        </div>
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon style={{ fontSize: 40, color: 'white' }} />
        </div>
      </div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
          <RiseOutlined style={{ fontSize: 16, marginRight: '4px', color: 'white' }} />
          <Text style={{ fontSize: '12px', color: 'white' }}>{trend}</Text>
        </div>
      )}
    </Card>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column' }}>
        <Spin size="large" />
        <Title level={5} style={{ marginTop: '16px' }}>
          Loading Dashboard...
        </Title>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '64px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={fetchDashboardStats}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  if (!stats) return null;

  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', auctions: 12, bids: 245, revenue: 45000 },
    { month: 'Feb', auctions: 15, bids: 298, revenue: 52000 },
    { month: 'Mar', auctions: 18, bids: 356, revenue: 61000 },
    { month: 'Apr', auctions: 22, bids: 412, revenue: 71000 },
    { month: 'May', auctions: 25, bids: 478, revenue: 82000 },
    { month: 'Jun', auctions: 28, bids: 534, revenue: 95000 },
  ];

  const auctionStatusData = [
    { name: 'Active', value: stats.activeAuctions, color: '#4caf50' },
    { name: 'Scheduled', value: stats.scheduledAuctions, color: '#2196f3' },
    { name: 'Completed', value: stats.completedAuctions, color: '#9c27b0' },
  ];

  const COLORS = ['#4caf50', '#2196f3', '#9c27b0'];

  return (
    <div style={{ width: '100%' }}>
      <div style={{ padding: '32px 20px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Title level={3} style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Dashboard Overview
          </Title>
          <Paragraph type="secondary">
            Welcome back! Here's what's happening with your platform today.
          </Paragraph>
        </div>

        {/* Metric Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={12} md={6}>
            <MetricCard
              title="Total Users"
              value={stats.totalUsers}
              subtitle={`${stats.activeUsers} active`}
              icon={UserOutlined}
              gradient={['#667eea', '#764ba2']}
              trend="+12% this month"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <MetricCard
              title="Active Auctions"
              value={stats.activeAuctions}
              subtitle="Currently running"
              icon={AuditOutlined}
              gradient={['#f093fb', '#f5576c']}
              trend="+8% this week"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <MetricCard
              title="Total Revenue"
              value={`$${(stats.totalRevenue || 0).toLocaleString()}`}
              subtitle="All time"
              icon={DollarOutlined}
              gradient={['#4facfe', '#00f2fe']}
              trend="+23% this month"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <MetricCard
              title="Total Bids"
              value={stats.totalBids}
              subtitle="Platform wide"
              icon={ShoppingCartOutlined}
              gradient={['#43e97b', '#38f9d7']}
              trend="+15% this week"
            />
          </Col>
        </Row>

        {/* Charts Section */}
        <Row gutter={[24, 24]}>
          {/* Revenue Trend Chart */}
          <Col xs={24} lg={16}>
            <Card style={{ height: '100%' }}>
              <Title level={5} style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Revenue & Auction Trends
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                Monthly performance overview
              </Text>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#667eea"
                    strokeWidth={3}
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="auctions"
                    stroke="#f5576c"
                    strokeWidth={3}
                    name="Auctions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Auction Status Distribution */}
          <Col xs={24} lg={8}>
            <Card style={{ height: '100%' }}>
              <Title level={5} style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Auction Distribution
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                By status
              </Text>
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Bidding Activity Chart */}
          <Col xs={24}>
            <Card>
              <Title level={5} style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Bidding Activity
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                Monthly bid volume
              </Text>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bids" fill="#4facfe" name="Total Bids" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Quick Stats Cards */}
          <Col xs={24} sm={12} md={6}>
            <Card style={{ textAlign: 'center' }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                Pending Approvals
              </Text>
              <Statistic
                value={stats.pendingApprovals}
                valueStyle={{ color: '#faad14', fontSize: '2rem', fontWeight: 'bold' }}
              />
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
                Awaiting review
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ textAlign: 'center' }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                Avg Bids/Auction
              </Text>
              <Statistic
                value={stats.averageBidsPerAuction?.toFixed(1) || '0.0'}
                valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }}
              />
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
                Platform average
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ textAlign: 'center' }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                New Today
              </Text>
              <Statistic
                value={stats.newUsersToday}
                valueStyle={{ color: '#52c41a', fontSize: '2rem', fontWeight: 'bold' }}
              />
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
                Registered today
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ textAlign: 'center' }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                Completion Rate
              </Text>
              <Statistic
                value={stats.completionRate?.toFixed(0) || '0'}
                suffix="%"
                valueStyle={{ color: '#13c2c2', fontSize: '2rem', fontWeight: 'bold' }}
              />
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
                Successful auctions
              </Text>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
