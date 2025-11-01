import { Typography, Box, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GavelIcon from '@mui/icons-material/Gavel';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, mb: 6 }}>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom align="center">
            Welcome to BRAVOCARS
          </Typography>
          <Typography variant="h5" align="center" sx={{ mb: 4 }}>
            Japan's Premier Car Auction Platform
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="secondary" size="large" component={Link} to="/auctions">
              Browse Auctions
            </Button>
            <Button variant="outlined" color="inherit" size="large" component={Link} to="/register">
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Why Choose BRAVOCARS?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <DirectionsCarIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Quality Vehicles
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Handpicked selection of premium Japanese vehicles from trusted sources
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <GavelIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Live Bidding
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Real-time auction system with instant updates and competitive pricing
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <VerifiedUserIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Secure & Trusted
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Admin-verified users and secure payment processing for peace of mind
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
