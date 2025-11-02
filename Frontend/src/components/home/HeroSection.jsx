import { Typography, Button, Space, Row, Col, Statistic } from 'antd';
import { CarOutlined, RiseOutlined, TeamOutlined, AuditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const HeroSection = ({ stats }) => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
        color: 'white',
        padding: '96px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        }}
      />
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Main Headline */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Title
            level={1}
            style={{
              fontSize: '4rem',
              fontWeight: 800,
              marginBottom: '16px',
              lineHeight: 1.2,
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              color: 'white',
            }}
          >
            Find Your Dream Car at Auction
          </Title>
          <Title
            level={4}
            style={{
              fontSize: '1.5rem',
              fontWeight: 400,
              marginBottom: '32px',
              opacity: 0.95,
              maxWidth: '800px',
              margin: '0 auto 32px',
              color: 'white',
            }}
          >
            Premium vehicles, competitive bidding, trusted platform
          </Title>

          {/* CTA Buttons */}
          <Space size="large" style={{ marginBottom: '48px' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/auctions')}
              style={{
                background: 'white',
                color: '#1976d2',
                padding: '12px 32px',
                height: 'auto',
                fontSize: '1.1rem',
                fontWeight: 600,
                border: 'none',
              }}
            >
              Browse Auctions
            </Button>
            <Button
              size="large"
              onClick={() => scrollToSection('how-it-works')}
              style={{
                borderColor: 'white',
                color: 'white',
                padding: '12px 32px',
                height: 'auto',
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'transparent',
              }}
            >
              How It Works
            </Button>
          </Space>

          {/* Stats Bar */}
          <Row
            gutter={[48, 24]}
            justify="center"
            style={{
              paddingTop: '32px',
              borderTop: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Col xs={12} sm={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <AuditOutlined style={{ fontSize: 32, marginRight: '8px', color: 'white' }} />
                  <Title level={3} style={{ fontWeight: 'bold', margin: 0, color: 'white' }}>
                    {stats?.totalAuctions || '500+'}
                  </Title>
                </div>
                <Text style={{ opacity: 0.9, color: 'white' }}>
                  Total Auctions
                </Text>
              </div>
            </Col>

            <Col xs={12} sm={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <RiseOutlined style={{ fontSize: 32, marginRight: '8px', color: 'white' }} />
                  <Title level={3} style={{ fontWeight: 'bold', margin: 0, color: 'white' }}>
                    ${stats?.totalValue || '50M+'}
                  </Title>
                </div>
                <Text style={{ opacity: 0.9, color: 'white' }}>
                  Value Sold
                </Text>
              </div>
            </Col>

            <Col xs={12} sm={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <TeamOutlined style={{ fontSize: 32, marginRight: '8px', color: 'white' }} />
                  <Title level={3} style={{ fontWeight: 'bold', margin: 0, color: 'white' }}>
                    {stats?.totalBidders || '10K+'}
                  </Title>
                </div>
                <Text style={{ opacity: 0.9, color: 'white' }}>
                  Happy Buyers
                </Text>
              </div>
            </Col>

            <Col xs={12} sm={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <CarOutlined style={{ fontSize: 32, marginRight: '8px', color: 'white' }} />
                  <Title level={3} style={{ fontWeight: 'bold', margin: 0, color: 'white' }}>
                    {stats?.activeBids || '250+'}
                  </Title>
                </div>
                <Text style={{ opacity: 0.9, color: 'white' }}>
                  Active Listings
                </Text>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
