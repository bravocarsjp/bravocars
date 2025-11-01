import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Paper,
  Divider,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { DirectionsCar, Speed, LocalGasStation, Settings } from '@mui/icons-material';
import { format } from 'date-fns';
import auctionService from '../../services/auctionService';
import useAuthStore from '../../stores/authStore';
import { toast } from 'react-toastify';

const AuctionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadAuction();
  }, [id]);

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

  const handlePlaceBid = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place a bid');
      navigate('/login');
      return;
    }

    if (bidAmount <= auction.currentPrice) {
      toast.error('Bid amount must be higher than current price');
      return;
    }

    toast.info('Bidding functionality coming soon!');
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
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !auction) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Auction not found'}</Alert>
        <Button onClick={() => navigate('/auctions')} sx={{ mt: 2 }}>
          Back to Auctions
        </Button>
      </Container>
    );
  }

  const car = auction.car;

  return (
    <Container sx={{ py: 4 }}>
      <Button onClick={() => navigate('/auctions')} sx={{ mb: 2 }}>
        Back to Auctions
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={car?.imageUrls?.[selectedImage] || '/placeholder-car.jpg'}
              alt={`${car?.make} ${car?.model}`}
              sx={{ objectFit: 'cover' }}
            />
            {car?.imageUrls && car.imageUrls.length > 1 && (
              <ImageList sx={{ height: 100 }} cols={4} rowHeight={100}>
                {car.imageUrls.map((url, index) => (
                  <ImageListItem
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    sx={{
                      cursor: 'pointer',
                      opacity: selectedImage === index ? 1 : 0.6,
                      border: selectedImage === index ? '2px solid primary.main' : 'none',
                    }}
                  >
                    <img src={url} alt={`View ${index + 1}`} loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Card>

          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Vehicle Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DirectionsCar sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Make & Model
                    </Typography>
                    <Typography variant="body1">
                      {car?.make} {car?.model}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Speed sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Mileage
                    </Typography>
                    <Typography variant="body1">
                      {car?.mileage?.toLocaleString()} miles
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Settings sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Transmission
                    </Typography>
                    <Typography variant="body1">{car?.transmission}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalGasStation sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fuel Type
                    </Typography>
                    <Typography variant="body1">{car?.fuelType}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                VIN
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                {car?.vin}
              </Typography>
            </Box>

            {car?.description && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">{car.description}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5">
                {car?.year} {car?.make} {car?.model}
              </Typography>
              <Chip label={auction.status} color={getStatusColor(auction.status)} />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Current Price
              </Typography>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                {formatPrice(auction.currentPrice)}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Starting Price
              </Typography>
              <Typography variant="h6">{formatPrice(auction.startingPrice)}</Typography>
            </Box>

            {auction.reservePrice && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Reserve Price
                </Typography>
                <Typography variant="h6">{formatPrice(auction.reservePrice)}</Typography>
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Start Time
              </Typography>
              <Typography variant="body1">
                {format(new Date(auction.startTime), 'PPpp')}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                End Time
              </Typography>
              <Typography variant="body1">
                {format(new Date(auction.endTime), 'PPpp')}
              </Typography>
            </Box>

            {auction.status === 'Active' && (
              <>
                <Divider sx={{ my: 2 }} />
                <TextField
                  fullWidth
                  type="number"
                  label="Your Bid Amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  sx={{ mb: 2 }}
                  helperText={`Minimum bid: ${formatPrice(auction.currentPrice + 100)}`}
                />
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handlePlaceBid}
                  disabled={!isAuthenticated || bidAmount <= auction.currentPrice}
                >
                  Place Bid
                </Button>
                {!isAuthenticated && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                    Please login to place a bid
                  </Typography>
                )}
              </>
            )}

            {auction.status === 'Completed' && (
              <Alert severity="info">This auction has ended</Alert>
            )}

            {auction.status === 'Scheduled' && (
              <Alert severity="info">This auction has not started yet</Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuctionDetailPage;
