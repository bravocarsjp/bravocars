import { Card, Typography, Button, Tag, Space } from 'antd';
import { ClockCircleOutlined, DashboardOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const { Title, Text } = Typography;

const EnhancedAuctionCard = ({ auction }) => {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Scheduled':
        return 'info';
      case 'Completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleClick = () => {
    if (auction.auctionId || auction.id) {
      navigate(`/auctions/${auction.auctionId || auction.id}`);
    }
  };

  return (
    <Card
      hoverable
      onClick={handleClick}
      cover={
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            alt={auction.name || auction.title}
            src={auction.image || auction.car?.imageUrls?.[0] || '/placeholder-car.jpg'}
            style={{
              height: '220px',
              width: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />

          {/* Status Badge */}
          {auction.status && (
            <Tag
              color={getStatusColor(auction.status)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                fontWeight: 600,
                backdropFilter: 'blur(8px)',
              }}
            >
              {auction.status}
            </Tag>
          )}

          {/* Countdown Badge */}
          {auction.endTime && auction.status === 'Active' && (
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ClockCircleOutlined style={{ fontSize: '14px' }} />
              <Text style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>
                {formatDistanceToNow(new Date(auction.endTime), { addSuffix: true })}
              </Text>
            </div>
          )}
        </div>
      }
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      bodyStyle={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}
    >
      {/* Title */}
      <Title
        level={5}
        ellipsis={{ rows: 2 }}
        style={{
          fontWeight: 600,
          marginBottom: '12px',
          minHeight: '3.5em',
        }}
      >
        {auction.name || auction.title}
      </Title>

      {/* Specs */}
      <Space wrap style={{ marginBottom: '16px', minHeight: '48px' }}>
        {auction.year && (
          <Text type="secondary">📅 {auction.year}</Text>
        )}
        {auction.mileage && (
          <Space size={4}>
            <DashboardOutlined style={{ fontSize: '14px' }} />
            <Text type="secondary">{auction.mileage.toLocaleString()} mi</Text>
          </Space>
        )}
        {auction.fuelType && (
          <Space size={4}>
            <ThunderboltOutlined style={{ fontSize: '14px' }} />
            <Text type="secondary">{auction.fuelType}</Text>
          </Space>
        )}
      </Space>

      {/* Price */}
      <div style={{ marginTop: 'auto', marginBottom: '16px' }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>
          Current Bid
        </Text>
        <Title
          level={4}
          style={{ color: '#1976d2', margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}
        >
          {formatPrice(auction.price || auction.currentPrice || auction.startingPrice)}
        </Title>
      </div>

      {/* Action Button */}
      <Button
        type="primary"
        block
        size="large"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        style={{
          padding: '10px 0',
          fontWeight: 600,
          fontSize: '1rem',
        }}
      >
        {auction.auctionId || auction.id ? 'View Auction' : 'Coming Soon'}
      </Button>
    </Card>
  );
};

export default EnhancedAuctionCard;
