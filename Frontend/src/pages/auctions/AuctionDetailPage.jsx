import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tag,
  Spin,
  Alert,
  Input,
  Divider,
  List,
  Space,
  Image,
  message,
} from 'antd';
import { CarOutlined, DashboardOutlined, ThunderboltOutlined, SettingOutlined, WifiOutlined, DisconnectOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import auctionService from '../../services/auctionService';
import bidService from '../../services/bidService';
import { signalRService } from '../../services/signalRService';
import useAuthStore from '../../stores/authStore';
import CountdownTimer from '../../components/auction/CountdownTimer';

const { Title, Text, Paragraph } = Typography;

const AuctionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [bids, setBids] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [placingBid, setPlacingBid] = useState(false);
  const [totalBids, setTotalBids] = useState(0);

  useEffect(() => {
    loadAuction();
    loadBids();

    // Connect to SignalR and join auction room
    const initializeSignalR = async () => {
      if (isAuthenticated) {
        const connected = await signalRService.connect();
        if (connected) {
          setIsConnected(true);
          await signalRService.joinAuction(Number(id));
        }
      }
    };

    initializeSignalR();

    // Subscribe to real-time events
    const unsubscribeBidPlaced = signalRService.on('bidPlaced', handleBidPlaced);
    const unsubscribeStatusChanged = signalRService.on('auctionStatusChanged', handleStatusChanged);
    const unsubscribeAuctionEnded = signalRService.on('auctionEnded', handleAuctionEnded);
    const unsubscribeCountdownUpdate = signalRService.on('countdownUpdate', handleCountdownUpdate);
    const unsubscribeReconnected = signalRService.on('reconnected', handleReconnected);
    const unsubscribeConnectionClosed = signalRService.on('connectionClosed', handleConnectionClosed);

    // Cleanup on unmount
    return () => {
      unsubscribeBidPlaced();
      unsubscribeStatusChanged();
      unsubscribeAuctionEnded();
      unsubscribeCountdownUpdate();
      unsubscribeReconnected();
      unsubscribeConnectionClosed();

      if (isAuthenticated) {
        signalRService.leaveAuction(Number(id));
      }
    };
  }, [id, isAuthenticated]);

  const loadAuction = async () => {
    try {
      setLoading(true);
      const result = await auctionService.getAuctionById(id);
      if (result.success) {
        setAuction(result.data);
        setBidAmount(result.data.currentPrice + 100);
      } else {
        setError(result.message || 'Failed to load auction');
      }
    } catch (err) {
      setError('An error occurred while loading the auction');
    } finally {
      setLoading(false);
    }
  };

  const loadBids = async () => {
    try {
      const result = await bidService.getBidsByAuctionId(id);
      if (result.success) {
        setBids(result.data || []);
        setTotalBids(result.data?.length || 0);
      }
    } catch (err) {
      console.error('Error loading bids:', err);
    }
  };

  // SignalR event handlers
  const handleBidPlaced = (bidInfo) => {
    console.log('New bid received:', bidInfo);

    // Update auction current price
    setAuction((prev) => ({
      ...prev,
      currentPrice: bidInfo.bidAmount,
    }));

    // Update minimum bid amount
    setBidAmount(bidInfo.bidAmount + 100);

    // Update total bids count
    setTotalBids(bidInfo.totalBids || totalBids + 1);

    // Show message notification
    message.info(`New bid placed: $${bidInfo.bidAmount.toLocaleString()} by ${bidInfo.bidderName}`);

    // Reload bids to show in history
    loadBids();
  };

  const handleStatusChanged = (statusInfo) => {
    console.log('Auction status changed:', statusInfo);
    setAuction((prev) => ({
      ...prev,
      status: statusInfo.status,
    }));
    message.info(`Auction status changed to: ${statusInfo.status}`);
  };

  const handleAuctionEnded = (auctionEndInfo) => {
    console.log('Auction ended:', auctionEndInfo);
    setAuction((prev) => ({
      ...prev,
      status: 'Completed',
    }));
    message.success('This auction has ended!');
    loadAuction(); // Reload to get final state
  };

  const handleReconnected = () => {
    console.log('SignalR reconnected');
    setIsConnected(true);
    message.success('Reconnected to live updates');
    loadAuction(); // Reload data after reconnection
    loadBids();
  };

  const handleConnectionClosed = () => {
    console.log('SignalR connection closed');
    setIsConnected(false);
    message.warning('Lost connection to live updates');
  };

  const handleCountdownUpdate = (countdownInfo) => {
    console.log('Countdown update received:', countdownInfo);
    // Countdown is already handled by the CountdownTimer component
    // We can use this to show additional notifications if needed
    if (countdownInfo.remainingMinutes === 5) {
      message.info('Only 5 minutes remaining in this auction!');
    } else if (countdownInfo.remainingMinutes === 1) {
      message.warning('Only 1 minute remaining!');
    }
  };

  const handlePlaceBid = async () => {
    if (!isAuthenticated) {
      message.error('Please login to place a bid');
      navigate('/login');
      return;
    }

    if (bidAmount <= auction.currentPrice) {
      message.error('Bid amount must be higher than current price');
      return;
    }

    try {
      setPlacingBid(true);
      const result = await bidService.placeBid(Number(id), bidAmount);

      if (result.success) {
        message.success('Bid placed successfully!');
        // The real-time update will handle UI changes via SignalR
      } else {
        message.error(result.message || 'Failed to place bid');
      }
    } catch (err) {
      message.error('An error occurred while placing your bid');
    } finally {
      setPlacingBid(false);
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div style={{ padding: '64px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <Alert message={error || 'Auction not found'} type="error" showIcon style={{ marginBottom: '16px' }} />
        <Button onClick={() => navigate('/auctions')}>
          Back to Auctions
        </Button>
      </div>
    );
  }

  const car = auction.car;

  return (
    <div style={{ padding: '32px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Button onClick={() => navigate('/auctions')} style={{ marginBottom: '16px' }}>
          ← Back to Auctions
        </Button>

        <Row gutter={[24, 24]}>
        <Col xs={24} md={14}>
          <Card>
            <Image
              src={car?.imageUrls?.[selectedImage] || '/placeholder-car.jpg'}
              alt={`${car?.make} ${car?.model}`}
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              preview={true}
            />
            {car?.imageUrls && car.imageUrls.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', padding: '8px' }}>
                {car.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    src={url}
                    alt={`View ${index + 1}`}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      opacity: selectedImage === index ? 1 : 0.6,
                      border: selectedImage === index ? '2px solid #1976d2' : 'none',
                      borderRadius: '4px',
                    }}
                  />
                ))}
              </div>
            )}
          </Card>

          <Card style={{ padding: '24px', marginTop: '16px' }}>
            <Title level={5} style={{ marginBottom: '16px' }}>
              Vehicle Details
            </Title>
            <Divider style={{ marginBottom: '16px' }} />
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Space align="start">
                  <CarOutlined style={{ color: 'rgba(0,0,0,0.45)', marginTop: '4px' }} />
                  <div>
                    <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                      Make & Model
                    </Text>
                    <Text>
                      {car?.make} {car?.model}
                    </Text>
                  </div>
                </Space>
              </Col>
              <Col xs={24} sm={12}>
                <Space align="start">
                  <DashboardOutlined style={{ color: 'rgba(0,0,0,0.45)', marginTop: '4px' }} />
                  <div>
                    <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                      Mileage
                    </Text>
                    <Text>
                      {car?.mileage?.toLocaleString()} miles
                    </Text>
                  </div>
                </Space>
              </Col>
              <Col xs={24} sm={12}>
                <Space align="start">
                  <SettingOutlined style={{ color: 'rgba(0,0,0,0.45)', marginTop: '4px' }} />
                  <div>
                    <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                      Transmission
                    </Text>
                    <Text>{car?.transmission}</Text>
                  </div>
                </Space>
              </Col>
              <Col xs={24} sm={12}>
                <Space align="start">
                  <ThunderboltOutlined style={{ color: 'rgba(0,0,0,0.45)', marginTop: '4px' }} />
                  <div>
                    <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                      Fuel Type
                    </Text>
                    <Text>{car?.fuelType}</Text>
                  </div>
                </Space>
              </Col>
            </Row>

            <div style={{ marginTop: '24px' }}>
              <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                VIN
              </Text>
              <Text style={{ fontFamily: 'monospace' }}>
                {car?.vin}
              </Text>
            </div>

            {car?.description && (
              <div style={{ marginTop: '24px' }}>
                <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                  Description
                </Text>
                <Paragraph>{car.description}</Paragraph>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={10}>
          <Card style={{ padding: '24px', position: 'sticky', top: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <Title level={4} style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
                {car?.year} {car?.make} {car?.model}
              </Title>
              <Space wrap>
                <Tag color={getStatusColor(auction.status)}>{auction.status}</Tag>
                {isAuthenticated && (
                  <Tag
                    icon={isConnected ? <WifiOutlined /> : <DisconnectOutlined />}
                    color={isConnected ? 'success' : 'default'}
                  >
                    {isConnected ? 'Live' : 'Offline'}
                  </Tag>
                )}
              </Space>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ marginBottom: '24px' }}>
              <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                Current Price
              </Text>
              <Title level={3} style={{ color: '#1976d2', fontWeight: 'bold', margin: 0, fontSize: '2rem' }}>
                {formatPrice(auction.currentPrice)}
              </Title>
              {totalBids > 0 && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {totalBids} bid{totalBids !== 1 ? 's' : ''} placed
                </Text>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                Starting Price
              </Text>
              <Title level={5} style={{ margin: 0 }}>{formatPrice(auction.startingPrice)}</Title>
            </div>

            {auction.reservePrice && (
              <div style={{ marginBottom: '24px' }}>
                <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                  Reserve Price
                </Text>
                <Title level={5} style={{ margin: 0 }}>{formatPrice(auction.reservePrice)}</Title>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                Start Time
              </Text>
              <Text>
                {format(new Date(auction.startTime), 'PPpp')}
              </Text>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                End Time
              </Text>
              <Text>
                {format(new Date(auction.endTime), 'PPpp')}
              </Text>
            </div>

            {auction.status === 'Active' && (
              <>
                <Divider style={{ margin: '16px 0' }} />
                <CountdownTimer
                  endTime={auction.endTime}
                  status={auction.status}
                />
              </>
            )}

            {auction.status === 'Active' && (
              <>
                <Divider style={{ margin: '16px 0' }} />
                <div style={{ marginBottom: '16px' }}>
                  <Input
                    type="number"
                    size="large"
                    placeholder="Your Bid Amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginTop: '4px' }}>
                    Minimum bid: {formatPrice(auction.currentPrice + 100)}
                  </Text>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handlePlaceBid}
                  disabled={!isAuthenticated || bidAmount <= auction.currentPrice || placingBid}
                  loading={placingBid}
                  style={{ padding: '12px 0' }}
                >
                  {placingBid ? 'Placing Bid...' : 'Place Bid'}
                </Button>
                {!isAuthenticated && (
                  <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: '8px', fontSize: '12px' }}>
                    Please login to place a bid
                  </Text>
                )}
              </>
            )}

            {auction.status === 'Completed' && (
              <Alert message="This auction has ended" type="info" showIcon />
            )}

            {auction.status === 'Scheduled' && (
              <Alert message="This auction has not started yet" type="info" showIcon />
            )}

            {bids.length > 0 && (
              <>
                <Divider style={{ margin: '24px 0' }} />
                <Title level={5} style={{ marginBottom: '16px' }}>
                  Bid History
                </Title>
                <div style={{ maxHeight: '300px', overflow: 'auto', background: '#fafafa', padding: '8px', borderRadius: '4px' }}>
                  <List
                    size="small"
                    dataSource={bids.slice(0, 10)}
                    renderItem={(bid, index) => (
                      <List.Item key={bid.id || index}>
                        <List.Item.Meta
                          title={formatPrice(bid.amount)}
                          description={`${bid.bidder?.firstName || 'Anonymous'} - ${format(new Date(bid.placedAt), 'PPp')}`}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </>
            )}
          </Card>
        </Col>
        </Row>
      </div>
    </div>
  );
};

export default AuctionDetailPage;
