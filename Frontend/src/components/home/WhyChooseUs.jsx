import { Row, Col, Card, Typography } from 'antd';
import {
  SafetyCertificateOutlined,
  CreditCardOutlined,
  CustomerServiceOutlined,
  CarOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const WhyChooseUs = () => {
  const features = [
    {
      icon: SafetyCertificateOutlined,
      title: 'Verified Vehicles',
      description: 'Every car is thoroughly inspected and verified by our expert team before listing',
      color: '#1976d2',
    },
    {
      icon: CreditCardOutlined,
      title: 'Secure Payments',
      description: 'Bank-level encryption and secure payment processing for your peace of mind',
      color: '#4caf50',
    },
    {
      icon: CustomerServiceOutlined,
      title: '24/7 Support',
      description: 'Dedicated customer support team available around the clock to assist you',
      color: '#f5576c',
    },
    {
      icon: CarOutlined,
      title: 'Nationwide Delivery',
      description: 'We arrange safe and reliable delivery to your doorstep anywhere in the country',
      color: '#ff9800',
    },
  ];

  return (
    <div style={{ padding: '80px 20px', background: '#fafafa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Title level={2} style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px' }}>
            Why Choose BRAVOCARS
          </Title>
          <Paragraph
            style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}
            type="secondary"
          >
            We're committed to providing the best car auction experience
          </Paragraph>
        </div>

        {/* Features Grid */}
        <Row gutter={[32, 32]} justify="center">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Col xs={24} sm={12} key={index}>
                <Card
                  hoverable
                  style={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    minHeight: '300px',
                    transition: 'all 0.3s ease',
                  }}
                  bodyStyle={{
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 70,
                      height: 70,
                      borderRadius: '8px',
                      background: `${feature.color}15`,
                      marginBottom: '16px',
                      margin: '0 auto 16px',
                    }}
                  >
                    <Icon style={{ fontSize: 40, color: feature.color }} />
                  </div>

                  {/* Title */}
                  <Title level={5} style={{ fontWeight: 600, marginBottom: '12px' }}>
                    {feature.title}
                  </Title>

                  {/* Description */}
                  <Paragraph
                    type="secondary"
                    style={{
                      minHeight: '5em',
                      lineHeight: 1.5,
                      textAlign: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {feature.description}
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

export default WhyChooseUs;
