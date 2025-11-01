import { Typography, Box } from '@mui/material';

const Auctions = () => {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h3" gutterBottom>
        Auctions
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Auction listings will be implemented in Phase 3
      </Typography>
    </Box>
  );
};

export default Auctions;
