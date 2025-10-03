import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation } from '../store/services/cartService';
import type { RootState } from '../store';

export function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: cartItems, isLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Please login to view your cart
        </Typography>
        <Button component={Link} to="/login" variant="contained" sx={{ mt: 2 }}>
          Login
        </Button>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Loading cart...</Typography>
      </Container>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Button component={Link} to="/products" variant="contained" sx={{ mt: 2 }}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  const subtotal = cartItems.reduce((sum: number, item: any) => {
    const itemPrice = item.price + (item.price_adjustment || 0);
    return sum + itemPrice * item.quantity;
  }, 0);

  const tax = subtotal * 0.1;
  const shipping = 10;
  const total = subtotal + tax + shipping;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ mb: 4 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            {cartItems.map((item: any) => (
              <Card key={item.id}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      component="img"
                      src={item.image || 'https://via.placeholder.com/100x100?text=Product'}
                      alt={item.name}
                      sx={{ width: 100, height: 100, objectFit: 'cover' }}
                    />

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{item.name}</Typography>
                      {item.size && (
                        <Typography variant="body2" color="text.secondary">
                          Size: {item.size} | Color: {item.color}
                        </Typography>
                      )}
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        ${item.price + (item.price_adjustment || 0)}
                      </Typography>
                    </Box>

                    <Select
                      value={item.quantity}
                      onChange={(e) => updateCartItem({ id: item.id, quantity: e.target.value })}
                      size="small"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <MenuItem key={num} value={num}>
                          {num}
                        </MenuItem>
                      ))}
                    </Select>

                    <IconButton onClick={() => removeFromCart(item.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>

              <Stack spacing={2} sx={{ mt: 3 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Subtotal</Typography>
                  <Typography>${subtotal.toFixed(2)}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography>Tax</Typography>
                  <Typography>${tax.toFixed(2)}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography>Shipping</Typography>
                  <Typography>${shipping.toFixed(2)}</Typography>
                </Stack>

                <Box sx={{ borderTop: '2px solid', borderColor: 'grey.300', pt: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">${total.toFixed(2)}</Typography>
                  </Stack>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => navigate('/checkout')}
                  sx={{ mt: 2 }}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  component={Link}
                  to="/products"
                  variant="outlined"
                  size="large"
                  fullWidth
                >
                  Continue Shopping
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}