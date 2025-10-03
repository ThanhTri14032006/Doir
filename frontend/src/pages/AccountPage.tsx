import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ProductCard } from '../components/ProductCard';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../store/services/wishlistService';
import { useAddToCartMutation } from '../store/services/cartService';
import type { RootState } from '../store';

export function AccountPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [tab, setTab] = useState(0);
  const [language, setLanguage] = useState<string>(() => localStorage.getItem('lang') || 'en');
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ mb: 2 }}>My Account</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Wishlist" />
        <Tab label="Settings" />
      </Tabs>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Profile Information
              </Typography>

              <Stack spacing={2} sx={{ mt: 3 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {user?.first_name} {user?.last_name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {user?.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Account Type
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {user?.role}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Quick Links
              </Typography>

              <Stack spacing={2} sx={{ mt: 3 }}>
                <Typography
                  sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                  onClick={() => navigate('/orders')}
                >
                  View Orders
                </Typography>
                <Typography
                  sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                  onClick={() => navigate('/cart')}
                >
                  Shopping Cart
                </Typography>
                <Typography sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }} onClick={() => navigate('/men')}>
                  Men Collection
                </Typography>
                <Typography sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }} onClick={() => navigate('/women')}>
                  Women Collection
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {tab === 1 && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Your Wishlist</Typography>
            <Chip label={`${wishlist?.length || 0} items`} />
          </Stack>
          <Grid container spacing={2}>
            {(wishlist || []).map((p: any) => (
              <Grid key={p.id} item xs={12} sm={6} md={4}>
                <ProductCard
                  product={p}
                  onAddToCart={async () => { try { await (addToCart as any)({ product_id: p.id, quantity: 1 }).unwrap?.(); } catch {} }}
                  onQuickView={() => navigate(`/products/${p.id}`)}
                />
                <Button size="small" color="secondary" sx={{ mt: 1 }} onClick={() => (removeFromWishlist as any)({ productId: p.id })}>Remove</Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {tab === 2 && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Settings</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="First Name" defaultValue={user?.first_name} sx={{ mb: 2 }} />
              <TextField fullWidth label="Last Name" defaultValue={user?.last_name} sx={{ mb: 2 }} />
              <TextField fullWidth label="Email" defaultValue={user?.email} sx={{ mb: 2 }} />
              <Select
                fullWidth
                value={language}
                onChange={(e) => { const v = e.target.value as string; setLanguage(v); localStorage.setItem('lang', v); }}
                sx={{ mb: 2 }}
                displayEmpty
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="vi">Tiếng Việt</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
              </Select>
              <Stack direction="row" spacing={2}>
                <Button variant="contained">Save Changes</Button>
                <Button variant="outlined" color="secondary">Change Password</Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Payment Methods</Typography>
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">You have no saved cards.</Typography>
              </Card>
              <Button variant="outlined">Add Card</Button>
            </Grid>
          </Grid>
        </Paper>
      )}

    </Container>
  );
}