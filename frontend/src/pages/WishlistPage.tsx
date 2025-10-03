import { useState } from 'react';
import { Link } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Mock wishlist data
const mockWishlist = [
  {
    id: 1,
    name: 'Dior Bar Jacket',
    price: 3500,
    category: 'Women',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600'
  },
  {
    id: 2,
    name: 'Lady Dior Bag',
    price: 5000,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600'
  }
];

export function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlist);

  const handleRemove = (id: number) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const handleAddToCart = (id: number) => {
    console.log('Add to cart:', id);
  };

  if (wishlistItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <FavoriteBorderIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Your Wishlist is Empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Save your favorite items here to purchase later
        </Typography>
        <Button component={Link} to="/products" variant="contained" size="large">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ mb: 4 }}>
        My Wishlist ({wishlistItems.length})
      </Typography>

      <Grid container spacing={3}>
        {wishlistItems.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={item.image}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                <IconButton
                  onClick={() => handleRemove(item.id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: 'grey.100' }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.category}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 'auto', mb: 2 }}>
                  ${item.price.toFixed(2)}
                </Typography>

                <Stack spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCart(item.id)}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    component={Link}
                    to={`/products/${item.id}`}
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    View Details
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}