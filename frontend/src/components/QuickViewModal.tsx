import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: 900,
    width: '90%',
    borderRadius: 0
  }
}));

interface QuickViewModalProps {
  open: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: number;
    compare_at_price?: number;
    description?: string;
    main_image?: string;
    category_name?: string;
    stock_quantity?: number;
  } | null;
  onAddToCart?: (productId: number, quantity: number) => void;
}

export function QuickViewModal({ open, onClose, product, onAddToCart }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart?.(product.id, quantity);
    onClose();
  };

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md">
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 1,
          backgroundColor: 'white',
          '&:hover': { backgroundColor: 'grey.100' }
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Product Image */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              minHeight: { xs: 300, md: 500 }
            }}
          >
            <Box
              component="img"
              src={product.main_image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600'}
              alt={product.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {discount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  backgroundColor: 'error.main',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                -{discount}%
              </Box>
            )}
          </Box>

          {/* Product Details */}
          <Box sx={{ flex: 1, p: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', mb: 1 }}>
              {product.category_name}
            </Typography>

            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              {product.name}
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                ${product.price.toFixed(2)}
              </Typography>
              {product.compare_at_price && (
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  ${product.compare_at_price.toFixed(2)}
                </Typography>
              )}
            </Stack>

            {product.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {product.description}
              </Typography>
            )}

            <Stack spacing={3}>
              <FormControl fullWidth size="small">
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
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={() => setIsWishlisted(!isWishlisted)}
                color={isWishlisted ? 'error' : 'inherit'}
              >
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </Stack>

            {product.stock_quantity && product.stock_quantity < 10 && product.stock_quantity > 0 && (
              <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
                Only {product.stock_quantity} left in stock!
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
}