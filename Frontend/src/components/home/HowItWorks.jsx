import { Row, Col, Card, Typography } from 'antd';
import { SearchOutlined, AuditOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const HowItWorks = () => {
  const steps = [
    {
      icon: SearchOutlined,
      title: 'Browse',
      description: 'Explore our curated selection of premium vehicles from trusted sellers',
      color: '#1976d2',
    },
    {
      icon: AuditOutlined,
      title: 'Bid',
      description: 'Place competitive bids in real-time auctions with transparent pricing',
      color: '#f5576c',
    },
    {
      icon: TrophyOutlined,
      title: 'Win',
      description: 'Win the auction and drive home your dream car with complete confidence',
      color: '#4caf50',
    },
  ];

  return (
    <div
      id="how-it-works"
      style={{
        padding: '80px 20px',
        background: '#fafafa',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Title level={2} style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px' }}>
            How It Works
          </Title>
          <Paragraph
            style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}
            type="secondary"
          >
            Start bidding in three simple steps
          </Paragraph>
        </div>

        {/* Steps Grid */}
        <Row gutter={[32, 32]} justify="center">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Col xs={24} sm={8} key={index}>
                <Card
                  hoverable
                  style={{
                    textAlign: 'center',
                    height: '100%',
                    minHeight: 380,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                  }}
                  bodyStyle={{
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  {/* Step Number */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: `${step.color}20`,
                      color: step.color,
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      marginBottom: '24px',
                      margin: '0 auto 24px',
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '8px',
                      background: `${step.color}15`,
                      marginBottom: '24px',
                      margin: '0 auto 24px',
                    }}
                  >
                    <Icon style={{ fontSize: 48, color: step.color }} />
                  </div>

                  {/* Title */}
                  <Title level={4} style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                    {step.title}
                  </Title>

                  {/* Description */}
                  <Paragraph
                    type="secondary"
                    style={{
                      minHeight: '4.5em',
                      lineHeight: 1.5,
                      overflow: 'hidden',
                    }}
                  >
                    {step.description}
                  </Paragraph>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default HowItWorks;
