import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { useGetCartQuery } from '../store/services/cartService';
import { useCreateOrderMutation } from '../store/services/ordersService';
import type { RootState } from '../store';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: cartItems, isFetching: isFetchingCart, isLoading: isLoadingCart } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  
  const [shippingInfo, setShippingInfo] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  });
  const [error, setError] = useState('');
  const [formTouched, setFormTouched] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'pickup'>('standard');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    setFormTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // In a real app, you would first create the address, then use its ID
      const result = await createOrder({
        payment_method: 'credit_card',
        ...shippingInfo
      }).unwrap();
      
      navigate(`/orders/${result.order.id}`);
    } catch (err: any) {
      setError(err.data?.message || 'Order creation failed');
    }
  };

  const isFormValid = useMemo(() => {
    const required = ['address_line1', 'city', 'state', 'postal_code', 'country'] as const;
    return required.every((k) => String(shippingInfo[k]).trim().length > 0);
  }, [shippingInfo]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && (!cartItems || cartItems.length === 0)) {
      navigate('/cart');
    }
  }, [cartItems, isAuthenticated, navigate]);

  const subtotal = cartItems.reduce((sum: number, item: any) => {
    const itemPrice = item.price + (item.price_adjustment || 0);
    return sum + itemPrice * item.quantity;
  }, 0);
  const tax = subtotal * 0.1;
  const shipping = shippingMethod === 'pickup' ? 0 : shippingMethod === 'express' ? 20 : 10;
  const total = subtotal + tax + shipping;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ mb: 4 }}>
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Shipping Information
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3} sx={{ mt: 3 }}>
                  <TextField
                    label="Address Line 1"
                    name="address_line1"
                    value={shippingInfo.address_line1}
                    onChange={handleChange}
                    required
                    fullWidth
                  />

                  <TextField
                    label="Address Line 2"
                    name="address_line2"
                    value={shippingInfo.address_line2}
                    onChange={handleChange}
                    fullWidth
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="City"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleChange}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="State"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleChange}
                        required
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Shipping Method
                    </Typography>
                    <RadioGroup
                      row
                      value={shippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value as 'standard' | 'express' | 'pickup')}
                    >
                      <FormControlLabel value="standard" control={<Radio />} label="Standard ($10)" />
                      <FormControlLabel value="express" control={<Radio />} label="Express ($20)" />
                      <FormControlLabel value="pickup" control={<Radio />} label="Store Pickup (Free)" />
                    </RadioGroup>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Postal Code"
                        name="postal_code"
                        value={shippingInfo.postal_code}
                        onChange={handleChange}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleChange}
                        required
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <TextField
                        label="Coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="apply coupon"
                                onClick={() => tryApplyCoupon()}
                                edge="end"
                                disabled={!couponInput.trim() || !!appliedCoupon}
                              >
                                <CheckCircleOutlineIcon />
                              </IconButton>
                              {appliedCoupon && (
                                <IconButton aria-label="remove coupon" onClick={removeCoupon} edge="end">
                                  <CancelOutlinedIcon />
                                </IconButton>
                              )}
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button
                        variant="outlined"
                        onClick={() => tryApplyCoupon()}
                        disabled={!couponInput.trim() || !!appliedCoupon}
                        fullWidth
                      >
                        Apply
                      </Button>
                    </Grid>
                  </Grid>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Payment Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Payment processing will be implemented in production.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: { md: 'sticky' }, top: { md: 16 } }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>

              <Stack spacing={2} sx={{ mt: 3 }}>
                {(isFetchingCart || isLoadingCart) && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CircularProgress size={16} />
                    <Typography variant="body2">Loading cart…</Typography>
                  </Stack>
                )}
                {(cartItems || []).map((item: any) => (
                  <Stack key={item.id} direction="row" justifyContent="space-between">
                    <Typography variant="body2">
                      {item.name} x {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      ${((item.price + (item.price_adjustment || 0)) * item.quantity).toFixed(2)}
                    </Typography>
                  </Stack>
                ))}

                <Box sx={{ borderTop: '1px solid', borderColor: 'grey.300', pt: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Subtotal</Typography>
                    <Typography>${subtotal.toFixed(2)}</Typography>
                  </Stack>

                  {appliedCoupon && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Discount ({appliedCoupon.code})</Typography>
                      <Typography>- ${discount.toFixed(2)}</Typography>
                    </Stack>
                  )}

                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Tax</Typography>
                    <Typography>${tax.toFixed(2)}</Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Shipping</Typography>
                    <Typography>${shipping.toFixed(2)}</Typography>
                  </Stack>
                </Box>

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
                  onClick={handleSubmit}
                  disabled={isLoading || (formTouched && !isFormValid)}
                  sx={{ mt: 2 }}
                >
                  {isLoading ? 'Processing...' : 'Place Order'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}