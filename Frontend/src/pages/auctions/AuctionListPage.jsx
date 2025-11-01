import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import auctionService from '../../services/auctionService';

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
        setAuctions(result.data);
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

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Active Auctions
      </Typography>

      {auctions.length === 0 ? (
        <Alert severity="info">No auctions available at the moment.</Alert>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {auctions.map((auction) => (
            <Grid item xs={12} sm={6} md={4} key={auction.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={auction.car?.imageUrls?.[0] || '/placeholder-car.jpg'}
                  alt={`${auction.car?.make} ${auction.car?.model}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" component="h2">
                      {auction.car?.year} {auction.car?.make}
                    </Typography>
                    <Chip
                      label={auction.status}
                      color={getStatusColor(auction.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {auction.car?.model}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {auction.car?.mileage?.toLocaleString()} miles
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Current Price
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                      {formatPrice(auction.currentPrice)}
                    </Typography>
                  </Box>
                  {auction.endTime && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Ends {formatDistanceToNow(new Date(auction.endTime), { addSuffix: true })}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/auctions/${auction.id}`)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AuctionListPage;
