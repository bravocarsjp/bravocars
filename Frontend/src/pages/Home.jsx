import { Typography, Button, Row, Col, Card, Space } from 'antd';
import { Link } from 'react-router-dom';
import { CarOutlined, AuditOutlined, SafetyOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div style={{ background: '#1976d2', color: '#ffffff', padding: '80px 20px', marginBottom: '48px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title level={1} style={{ color: '#ffffff', marginBottom: '16px' }}>
            Welcome to BRAVOCARS
          </Title>
          <Title level={3} style={{ color: '#ffffff', fontWeight: 'normal', marginBottom: '32px' }}>
            Japan's Premier Car Auction Platform
          </Title>
          <Space size="large">
            <Link to="/auctions">
              <Button type="primary" size="large" danger>
                Browse Auctions
              </Button>
            </Link>
            <Link to="/register">
              <Button size="large" style={{ background: 'transparent', color: '#ffffff', borderColor: '#ffffff' }}>
                Get Started
              </Button>
            </Link>
          </Space>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 80px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
          Why Choose BRAVOCARS?
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card hoverable style={{ height: '100%', textAlign: 'center', padding: '24px' }}>
              <CarOutlined style={{ fontSize: '60px', color: '#1976d2', marginBottom: '16px' }} />
              <Title level={4}>Quality Vehicles</Title>
              <Paragraph type="secondary">
                Handpicked selection of premium Japanese vehicles from trusted sources
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable style={{ height: '100%', textAlign: 'center', padding: '24px' }}>
              <AuditOutlined style={{ fontSize: '60px', color: '#1976d2', marginBottom: '16px' }} />
              <Title level={4}>Live Bidding</Title>
              <Paragraph type="secondary">
                Real-time auction system with instant updates and competitive pricing
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable style={{ height: '100%', textAlign: 'center', padding: '24px' }}>
              <SafetyOutlined style={{ fontSize: '60px', color: '#1976d2', marginBottom: '16px' }} />
              <Title level={4}>Secure & Trusted</Title>
              <Paragraph type="secondary">
                Admin-verified users and secure payment processing for peace of mind
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
