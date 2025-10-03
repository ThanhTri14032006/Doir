import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { useGetUserOrdersQuery } from '../store/services/ordersService';
import type { RootState } from '../store';

export function OrdersPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: orders, isLoading } = useGetUserOrdersQuery(undefined, { skip: !isAuthenticated });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ mb: 4 }}>
        My Orders
      </Typography>

      {isLoading ? (
        <Typography>Loading orders...</Typography>
      ) : !orders || orders.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" gutterBottom>
              No orders yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start shopping to see your orders here
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={3}>
          {orders.map((order: any) => (
            <Card key={order.id}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="h6">
                      Order #{order.order_number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(order.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Amount
                    </Typography>
                    <Typography variant="h6">
                      ${order.total}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Shipping Address
                    </Typography>
                    <Typography variant="body2">
                      {order.address_line1}, {order.city}, {order.state} {order.postal_code}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}