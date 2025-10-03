import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };
  return (
    <Box sx={{ py: 8, background: 'linear-gradient(135deg, #111, #1f1f1f)' }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center', color: 'white' }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 600 }}>Get 10% Off Your First Order</Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'grey.400' }}>
          Join our newsletter for exclusive deals and early access releases.
        </Typography>
        <Stack component="form" onSubmit={subscribe} direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <TextField
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ minWidth: { xs: '100%', sm: 360 }, bgcolor: 'white', borderRadius: 1 }}
            size="small"
          />
          <Button type="submit" variant="contained" size="large">Subscribe</Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default Newsletter;

