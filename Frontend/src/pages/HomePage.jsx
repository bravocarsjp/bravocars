import { useState, useEffect } from 'react';
import { Row, Col, Typography, Spin, Button } from 'antd';
import auctionService from '../services/auctionService';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

// Import new components
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CTABanner from '../components/home/CTABanner';
import EnhancedAuctionCard from '../components/home/EnhancedAuctionCard';

const HomePage = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      const result = await auctionService.getAuctions({
        pageNumber: 1,
        pageSize: 9,
        status: 'Active',
      });

      if (result.success) {
        setAuctions(result.data.items || []);
      }
    } catch (err) {
      console.error('Error loading auctions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fallback sample car data
  const sampleCars = [
    {
      id: 1,
      name: '2023 Tesla Model S Plaid',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop',
      description: 'Electric luxury sedan with autopilot',
      price: 89990,
      year: 2023,
      make: 'Tesla',
      model: 'Model S',
      mileage: 5000,
      fuelType: 'Electric',
      status: 'Active',
    },
    {
      id: 2,
      name: '2022 Porsche 911 GT3',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop',
      description: 'High-performance sports coupe',
      price: 185000,
      year: 2022,
      make: 'Porsche',
      model: '911 GT3',
      mileage: 8000,
      fuelType: 'Gasoline',
      status: 'Active',
    },
    {
      id: 3,
      name: '2024 Mercedes-AMG GT 63',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop',
      description: 'Ultimate luxury and performance',
      price: 152000,
      year: 2024,
      make: 'Mercedes-AMG',
      model: 'GT 63',
      mileage: 2000,
      fuelType: 'Hybrid',
      status: 'Active',
    },
    {
      id: 4,
      name: '2023 BMW M4 Competition',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop',
      description: 'M xDrive with Carbon Fiber Package',
      price: 78990,
      year: 2023,
      make: 'BMW',
      model: 'M4 Competition',
      mileage: 12000,
      fuelType: 'Gasoline',
      status: 'Active',
    },
    {
      id: 5,
      name: '2024 Audi RS e-tron GT',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop',
      description: 'Electric performance sedan',
      price: 145000,
      year: 2024,
      make: 'Audi',
      model: 'RS e-tron GT',
      mileage: 1500,
      fuelType: 'Electric',
      status: 'Active',
    },
    {
      id: 6,
      name: '2023 Lamborghini Huracán EVO',
      image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600&h=400&fit=crop',
      description: 'Italian supercar excellence',
      price: 265000,
      year: 2023,
      make: 'Lamborghini',
      model: 'Huracán EVO',
      mileage: 2500,
      fuelType: 'Gasoline',
      status: 'Active',
    },
    {
      id: 7,
      name: '2022 Ferrari F8 Tributo',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop',
      description: 'V8 twin-turbo masterpiece',
      price: 289990,
      year: 2022,
      make: 'Ferrari',
      model: 'F8 Tributo',
      mileage: 3000,
      fuelType: 'Gasoline',
      status: 'Active',
    },
    {
      id: 8,
      name: '2024 Range Rover Autobiography',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop',
      description: 'Luxury SUV with off-road capability',
      price: 125000,
      year: 2024,
      make: 'Land Rover',
      model: 'Range Rover',
      mileage: 5000,
      fuelType: 'Diesel',
      status: 'Active',
    },
    {
      id: 9,
      name: '2023 McLaren 720S Spider',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=400&fit=crop',
      description: 'British engineering excellence',
      price: 315000,
      year: 2023,
      make: 'McLaren',
      model: '720S Spider',
      mileage: 4000,
      fuelType: 'Gasoline',
      status: 'Active',
    },
  ];

  // Transform auctions to card format
  const displayCars = auctions.length > 0
    ? auctions.map((auction) => ({
        id: auction.id,
        auctionId: auction.id,
        name: auction.title,
        image: auction.car?.imageUrls?.[0] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop',
        description: auction.description || auction.car?.description || 'Premium vehicle',
        price: auction.currentPrice || auction.startingPrice,
        year: auction.car?.year,
        make: auction.car?.make,
        model: auction.car?.model,
        mileage: auction.car?.mileage,
        fuelType: auction.car?.fuelType,
        status: auction.status,
        endTime: auction.endTime,
      }))
    : sampleCars;

  // Mock stats for hero section
  const heroStats = {
    totalAuctions: '500+',
    totalValue: '50M',
    totalBidders: '10K+',
    activeBids: auctions.length > 0 ? auctions.length : '250+',
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Hero Section */}
      <HeroSection stats={heroStats} />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Featured Auctions Section */}
      <div style={{ padding: '80px 20px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Title
              level={2}
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              {auctions.length > 0 ? 'Live Auctions' : 'Featured Vehicles'}
            </Title>
            <Paragraph
              type="secondary"
              style={{ fontSize: '1.25rem' }}
            >
              {auctions.length > 0
                ? `${auctions.length} active auctions - Place your bids now!`
                : 'Discover premium cars at competitive auction prices'}
            </Paragraph>
          </div>

          {/* Loading State */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              {/* Auctions Grid */}
              <Row gutter={[24, 24]} justify="center" style={{ marginBottom: '32px' }}>
                {displayCars.map((car) => (
                  <Col xs={24} sm={12} lg={8} key={car.id}>
                    <EnhancedAuctionCard auction={car} />
                  </Col>
                ))}
              </Row>

              {/* View All Button */}
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate('/auctions')}
                  style={{
                    padding: '12px 48px',
                    height: 'auto',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  View All Auctions
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* CTA Banner */}
      <CTABanner />
    </div>
  );
};

export default HomePage;
