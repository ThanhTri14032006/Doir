import { Link } from 'react-router';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { styled, keyframes } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useGetFeaturedProductsQuery } from '../store/services/productsService';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Toast } from '../components/Toast';
import { IntroVideo } from '../components/IntroVideo';
import { Newsletter } from '../components/Newsletter';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '85vh',
  background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
    animation: `${fadeIn} 1s ease-out`
  }
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)'
  }
}));

export function HomePage() {
  const { data: featuredProducts, isLoading } = useGetFeaturedProductsQuery(undefined);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleAddToCart = (productId: number) => {
    setToastMessage('Product added to cart!');
    setToastOpen(true);
  };

  const handleQuickView = (productId: number) => {
    const product = featuredProducts?.find((p: any) => p.id === productId);
    setSelectedProduct(product);
  };

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              mb: 3, 
              fontSize: { xs: '2.5rem', md: '5rem' },
              fontWeight: 700,
              letterSpacing: '-0.02em',
              animation: `${fadeIn} 0.8s ease-out`
            }}
          >
            Luxury Redefined
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 5, 
              fontWeight: 300, 
              color: 'grey.300',
              maxWidth: 600,
              mx: 'auto',
              animation: `${fadeIn} 0.8s ease-out 0.2s both`
            }}
          >
            Discover the latest collection of haute couture fashion. Elegance meets innovation.
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ animation: `${fadeIn} 0.8s ease-out 0.4s both` }}
          >
            <Button
              component={Link}
              to="/products"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                px: 5, 
                py: 1.5,
                fontSize: '1.1rem',
                backgroundColor: 'secondary.main',
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)'
                }
              }}
            >
              Shop Now
            </Button>
            <Button
              component={Link}
              to="/products?category=women"
              variant="outlined"
              size="large"
              sx={{ 
                px: 5, 
                py: 1.5,
                fontSize: '1.1rem',
                color: 'white', 
                borderColor: 'white',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Women's Collection
            </Button>
          </Stack>
        </Container>
      </HeroSection>

      {/* Intro Video */}
      <Container maxWidth="lg" sx={{ mt: -8 }}>
        <IntroVideo />
      </Container>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard>
                <LocalShippingIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Free Shipping</Typography>
                <Typography variant="body2" color="text.secondary">
                  On orders over $500
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard>
                <VerifiedUserIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Secure Payment</Typography>
                <Typography variant="body2" color="text.secondary">
                  100% secure transactions
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard>
                <SupportAgentIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>24/7 Support</Typography>
                <Typography variant="body2" color="text.secondary">
                  Dedicated customer service
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard>
                <ArrowForwardIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Easy Returns</Typography>
                <Typography variant="body2" color="text.secondary">
                  30-day return policy
                </Typography>
              </FeatureCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Brand strip */}
      <Box sx={{ py: 4, bgcolor: 'grey.100', borderTop: '1px solid', borderColor: 'grey.200' }}>
        <Container maxWidth="xl" sx={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', opacity: 0.8 }}>
          {['DIOR', 'CHANEL', 'GUCCI', 'PRADA', 'LV'].map((b) => (
            <Typography key={b} variant="h5" sx={{ fontFamily: "'Playfair Display', serif", letterSpacing: 4 }}>{b}</Typography>
          ))}
        </Container>
      </Box>

      {/* Featured Products */}
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              mb: 2,
              fontWeight: 600,
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 60,
                height: 3,
                backgroundColor: 'secondary.main'
              }
            }}
          >
            Featured Collection
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
            Handpicked selection of our most exclusive pieces
          </Typography>
        </Box>

        {isLoading ? (
          <Typography align="center">Loading...</Typography>
        ) : (
          <Grid container spacing={4}>
            {featuredProducts?.slice(0, 8).map((product: any) => (
              <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
                <ProductCard 
                  product={product}
                  onAddToCart={handleAddToCart}
                  onQuickView={handleQuickView}
                />
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Button 
            component={Link} 
            to="/products" 
            variant="outlined" 
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ px: 4 }}
          >
            View All Products
          </Button>
        </Box>
      </Container>

      {/* Newsletter CTA */}
      <Newsletter />

      <QuickViewModal
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />

      <Toast
        open={toastOpen}
        message={toastMessage}
        severity="success"
        onClose={() => setToastOpen(false)}
      />

      {/* Categories Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="xl">
          <Typography variant="h2" align="center" sx={{ mb: 6 }}>
            Shop by Category
          </Typography>

          <Grid container spacing={3}>
            {[
              { name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600' },
              { name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600' },
              { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600' }
            ].map((category) => (
              <Grid key={category.slug} item xs={12} md={4}>
                <Card
                  component={Link}
                  to={`/products?category=${category.slug}`}
                  sx={{
                    position: 'relative',
                    height: 400,
                    textDecoration: 'none',
                    overflow: 'hidden',
                    '&:hover img': { transform: 'scale(1.1)' }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="400"
                    image={category.image}
                    alt={category.name}
                    sx={{ transition: 'transform 0.5s' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      p: 3
                    }}
                  >
                    <Typography variant="h4">{category.name}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}