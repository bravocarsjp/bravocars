import { Typography, Button, Space } from 'antd';
import { ArrowRightOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const CTABanner = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
        <Title
          level={2}
          style={{
            fontSize: '3rem',
            fontWeight: 700,
            marginBottom: '16px',
            color: 'white',
          }}
        >
          Ready to Start Bidding?
        </Title>
        <Title
          level={4}
          style={{
            fontSize: '1.25rem',
            marginBottom: '32px',
            opacity: 0.95,
            fontWeight: 400,
            color: 'white',
          }}
        >
          Join thousands of satisfied buyers and find your perfect car today
        </Title>

        <Space size="large">
          <Button
            type="primary"
            size="large"
            icon={<UserAddOutlined />}
            onClick={() => navigate('/register')}
            style={{
              background: 'white',
              color: '#667eea',
              padding: '12px 32px',
              height: 'auto',
              fontSize: '1.1rem',
              fontWeight: 600,
              border: 'none',
            }}
          >
            Get Started Free
          </Button>
          <Button
            size="large"
            onClick={() => navigate('/auctions')}
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
            Browse Auctions <ArrowRightOutlined />
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default CTABanner;
