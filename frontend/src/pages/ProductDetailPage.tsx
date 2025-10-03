import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';
import { useGetProductByIdQuery } from '../store/services/productsService';
import { useAddToCartMutation } from '../store/services/cartService';
import type { RootState } from '../store';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: product, isLoading } = useGetProductByIdQuery(id!);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToCart({
        product_id: Number(id),
        variant_id: selectedVariant,
        quantity
      }).unwrap();
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Product not found</Typography>
      </Container>
    );
  }

  const priceNum = typeof (product as any).price === 'string' ? parseFloat((product as any).price) : (product as any).price;
  const images: { image_url: string; alt_text?: string }[] = product.images && product.images.length > 0
    ? product.images
    : [{ image_url: 'https://via.placeholder.com/800x800?text=Product' }];

  const availableColors = useMemo(() => {
    if (!product.variants) return [] as string[];
    const set = new Set<string>();
    for (const v of product.variants as any[]) {
      if (v.color) set.add(v.color as string);
    }
    return Array.from(set);
  }, [product.variants]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Product added to cart successfully!
        </Alert>
      )}

      <Grid container spacing={4} alignItems="flex-start">
        <Grid item xs={12} md={6}>
          <Box sx={{
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'grey.200',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            maxWidth: '100%'
          }}>
            <Box
              component="img"
              src={images[activeImageIndex]?.image_url}
              alt={images[activeImageIndex]?.alt_text || product.name}
              sx={{ width: '100%', height: 520, objectFit: 'contain', bgcolor: 'grey.50', display: 'block' }}
            />
          </Box>

          <Stack direction="row" spacing={2} sx={{ mt: 2, overflowX: 'auto', pb: 1 }}>
            {images.map((img, idx) => (
              <Box
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                sx={{
                  width: 96,
                  height: 96,
                  borderRadius: 1,
                  border: '2px solid',
                  borderColor: idx === activeImageIndex ? 'primary.main' : 'grey.300',
                  overflow: 'hidden',
                  flex: '0 0 auto',
                  cursor: 'pointer',
                  bgcolor: 'white'
                }}
              >
                <Box component="img" src={img.image_url} alt={img.alt_text || product.name}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={6} sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
          <Typography variant="h3" gutterBottom>
            {product.name}
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
            ${priceNum?.toFixed ? priceNum.toFixed(2) : priceNum}
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            {product.description}
          </Typography>

          <Stack spacing={3} sx={{ mt: 4 }}>
            {availableColors.length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Màu sắc</Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {availableColors.map((c) => (
                    <Box key={c} sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'grey.300',
                      bgcolor: 'grey.50',
                      fontSize: 13
                    }}>{c}</Box>
                  ))}
                </Stack>
              </Box>
            )}
            {product.variants && product.variants.length > 0 && (
              <FormControl fullWidth>
                <InputLabel>Select Variant</InputLabel>
                <Select
                  value={selectedVariant || ''}
                  onChange={(e) => setSelectedVariant(Number(e.target.value))}
                  label="Select Variant"
                >
                  {product.variants.map((variant: any) => (
                    <MenuItem key={variant.id} value={variant.id}>
                      {variant.size} - {variant.color}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth>
              <InputLabel>Quantity</InputLabel>
              <Select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                label="Quantity"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleAddToCart}
              disabled={isAdding || product.stock_quantity === 0}
            >
              {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={handleBuyNow}
              disabled={isAdding || product.stock_quantity === 0}
            >
              Buy Now
            </Button>
          </Stack>

          <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>SKU:</strong> {product.sku}
              </Typography>
              <Typography variant="body2">
                <strong>Category:</strong> {product.category_name}
              </Typography>
              <Typography variant="body2">
                <strong>Stock:</strong> {product.stock_quantity} available
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}