import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  Divider,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import useAuthStore from '../../stores/authStore';

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'error';
      case 'Seller':
        return 'primary';
      case 'Bidder':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto',
                bgcolor: 'primary.main',
                fontSize: '3rem',
              }}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
            <Typography variant="h5" sx={{ mt: 2 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {user?.email}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
              <Chip label={user?.role} color={getRoleColor(user?.role)} size="small" />
              <Chip
                label={user?.status}
                color={getStatusColor(user?.status)}
                size="small"
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  First Name
                </Typography>
                <Typography variant="body1">{user?.firstName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Last Name
                </Typography>
                <Typography variant="body1">{user?.lastName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Email Address
                </Typography>
                <Typography variant="body1">{user?.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1">{user?.role}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Account Status
                </Typography>
                <Typography variant="body1">{user?.status}</Typography>
              </Grid>
            </Grid>

            {user?.status === 'Pending' && (
              <Alert severity="info" sx={{ mt: 3 }}>
                Your account is pending approval. You will be able to participate in
                auctions once an administrator approves your account.
              </Alert>
            )}

            {user?.status === 'Suspended' && (
              <Alert severity="error" sx={{ mt: 3 }}>
                Your account has been suspended. Please contact support for more
                information.
              </Alert>
            )}
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Bid History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Alert severity="info">
              Bid history functionality will be available once bidding is implemented.
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
