import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Spin, Alert, Button, Card, Tag, Space } from 'antd';
import { CarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import auctionService from '../../services/auctionService';

const { Title, Text } = Typography;

const AuctionListPage = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      const result = await auctionService.getAuctions();
      if (result.success) {
        setAuctions(result.data.items || []);
      } else {
        setError(result.message || 'Failed to load auctions');
      }
    } catch (err) {
      setError('An error occurred while loading auctions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Scheduled':
        return 'info';
      case 'Completed':
        return 'default';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Dummy/fallback auctions for demonstration
  const dummyAuctions = [
    {
      id: 1,
      title: '2023 Tesla Model S Plaid',
      description: 'Tri-Motor AWD, Long Range, Premium Interior',
      currentPrice: 89990,
      startingPrice: 85000,
      status: 'Active',
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      car: {
        year: 2023,
        make: 'Tesla',
        model: 'Model S Plaid',
        mileage: 5000,
        fuelType: 'Electric',
        imageUrls: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=250&fit=crop']
      }
    },
    {
      id: 2,
      title: '2022 Porsche 911 GT3',
      description: 'Track-ready performance, Carbon fiber aero',
      currentPrice: 185000,
      startingPrice: 180000,
      status: 'Active',
      endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      car: {
        year: 2022,
        make: 'Porsche',
        model: '911 GT3',
        mileage: 8000,
        fuelType: 'Gasoline',
        imageUrls: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop']
      }
    },
    {
      id: 3,
      title: '2024 Mercedes-AMG GT 63',
      description: '4MATIC+, Performance Package, Exclusive Interior',
      currentPrice: 152000,
      startingPrice: 148000,
      status: 'Active',
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      car: {
        year: 2024,
        make: 'Mercedes-AMG',
        model: 'GT 63',
        mileage: 2000,
        fuelType: 'Hybrid',
        imageUrls: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop']
      }
    },
    {
      id: 4,
      title: '2023 BMW M4 Competition',
      description: 'M xDrive, Carbon Fiber Package, M Performance Exhaust',
      currentPrice: 78990,
      startingPrice: 75000,
      status: 'Active',
      endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      car: {
        year: 2023,
        make: 'BMW',
        model: 'M4 Competition',
        mileage: 12000,
        fuelType: 'Gasoline',
        imageUrls: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop']
      }
    },
    {
      id: 5,
      title: '2024 Audi RS e-tron GT',
      description: 'Electric Performance, Sport Diff, Dynamic Package',
      currentPrice: 145000,
      startingPrice: 140000,
      status: 'Active',
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      car: {
        year: 2024,
        make: 'Audi',
        model: 'RS e-tron GT',
        mileage: 1500,
        fuelType: 'Electric',
        imageUrls: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop']
      }
    },
    {
      id: 6,
      title: '2023 Lamborghini Huracán EVO',
      description: 'V10 Power, Carbon-Ceramic Brakes, Sport Exhaust',
      currentPrice: 265000,
      startingPrice: 260000,
      status: 'Active',
      endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      car: {
        year: 2023,
        make: 'Lamborghini',
        model: 'Huracán EVO',
        mileage: 2500,
        fuelType: 'Gasoline',
        imageUrls: ['https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=400&h=250&fit=crop']
      }
    },
    {
      id: 7,
      title: '2022 Ferrari F8 Tributo',
      description: 'Italian Supercar, Carbon Package, Racing Seats',
      currentPrice: 289990,
      startingPrice: 285000,
      status: 'Active',
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      car: {
        year: 2022,
        make: 'Ferrari',
        model: 'F8 Tributo',
        mileage: 3000,
        fuelType: 'Gasoline',
        imageUrls: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=250&fit=crop']
      }
    },
    {
      id: 8,
      title: '2024 Range Rover Autobiography',
      description: 'Luxury SUV, Black Pack, Executive Class Comfort',
      currentPrice: 125000,
      startingPrice: 120000,
      status: 'Active',
      endTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      car: {
        year: 2024,
        make: 'Land Rover',
        model: 'Range Rover Autobiography',
        mileage: 5000,
        fuelType: 'Diesel',
        imageUrls: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop']
      }
    },
    {
      id: 9,
      title: '2023 McLaren 720S Spider',
      description: 'Convertible Supercar, MSO Package, Carbon Fiber',
      currentPrice: 315000,
      startingPrice: 310000,
      status: 'Active',
      endTime: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      car: {
        year: 2023,
        make: 'McLaren',
        model: '720S Spider',
        mileage: 4000,
        fuelType: 'Gasoline',
        imageUrls: ['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=250&fit=crop']
      }
    },
  ];

  // Use real auctions if available, otherwise show dummy data
  const displayAuctions = auctions.length > 0 ? auctions : dummyAuctions;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '48px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <CarOutlined style={{ fontSize: '48px', color: '#1976d2', marginBottom: '16px' }} />
          <Title level={1} style={{ marginBottom: '8px' }}>
            Live Auctions
          </Title>
          <Text type="secondary" style={{ fontSize: '18px' }}>
            {displayAuctions.length} active auctions - Place your bids now!
          </Text>
        </div>

        {/* Error Alert */}
        {error && !loading && (
          <Alert
            message={`${error} - Showing sample auctions for demonstration`}
            type="warning"
            showIcon
            style={{ marginBottom: '32px' }}
          />
        )}

        {/* Auctions Grid - 3 per row */}
        <Row gutter={[24, 24]}>
          {displayAuctions.map((auction) => (
            <Col xs={24} sm={12} lg={8} key={auction.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={auction.title}
                    src={auction.car?.imageUrls?.[0] || '/placeholder-car.jpg'}
                    style={{ height: '220px', objectFit: 'cover' }}
                  />
                }
                onClick={() => navigate(`/auctions/${auction.id}`)}
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                bodyStyle={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
              >
                {/* Title */}
                <Title level={5} ellipsis style={{ marginBottom: '8px' }}>
                  {auction.title}
                </Title>

                {/* Description */}
                <Text type="secondary" style={{ marginBottom: '16px', minHeight: '40px', display: 'block' }}>
                  {auction.description || auction.car?.description || 'Premium vehicle'}
                </Text>

                {/* Specs */}
                <Space wrap style={{ marginBottom: '16px' }}>
                  {auction.car?.year && (
                    <Text type="secondary">📅 {auction.car.year}</Text>
                  )}
                  {auction.car?.mileage && (
                    <Text type="secondary">🛣️ {auction.car.mileage.toLocaleString()} mi</Text>
                  )}
                  {auction.car?.fuelType && (
                    <Text type="secondary">⛽ {auction.car.fuelType}</Text>
                  )}
                </Space>

                {/* Time Remaining */}
                {auction.endTime && auction.status === 'Active' && (
                  <Space style={{ marginBottom: '16px' }}>
                    <ClockCircleOutlined />
                    <Text type="secondary">
                      Ends {formatDistanceToNow(new Date(auction.endTime), { addSuffix: true })}
                    </Text>
                  </Space>
                )}

                {/* Price */}
                <div style={{ marginTop: 'auto' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>
                    Current Bid
                  </Text>
                  <Title level={4} style={{ color: '#1976d2', margin: 0 }}>
                    {formatPrice(auction.currentPrice)}
                  </Title>
                </div>

                {/* Action Button */}
                <Button
                  type="primary"
                  block
                  style={{ marginTop: '16px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/auctions/${auction.id}`);
                  }}
                >
                  View Auction
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        {/* No Auctions Message */}
        {displayAuctions.length === 0 && !loading && (
          <div style={{ textAlign: 'center', marginTop: '64px' }}>
            <Title level={4} type="secondary">
              No active auctions at the moment
            </Title>
            <Text type="secondary">
              Check back soon for new listings!
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionListPage;
