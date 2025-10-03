import { Link } from 'react-router';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { styled } from '@mui/material/styles';
import { useAddToWishlistMutation } from '../store/services/wishlistService';

const StyledCard = styled(Card)(() => ({
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    '& .product-actions': {
      opacity: 1,
      transform: 'translateY(0)'
    },
    '& .product-image': {
      transform: 'scale(1.05)'
    }
  }
}));

const ProductActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, calc(-50% + 20px))',
  display: 'flex',
  gap: theme.spacing(1),
  opacity: 0,
  transition: 'all 0.3s ease',
  zIndex: 2
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    transform: 'scale(1.1)'
  }
}));

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    // Backend may return DECIMAL as string → coerce to number where used
    price: number | string;
    compare_at_price?: number | string;
    main_image?: string;
    category_name?: string;
    is_featured?: boolean;
  };
  onAddToCart?: (productId: number) => void;
  onQuickView?: (productId: number) => void;
  showHotBadge?: boolean;
}

export function ProductCard({ product, onAddToCart, onQuickView, showHotBadge }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addToWishlist] = useAddToWishlistMutation();

  const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const compareNum = typeof product.compare_at_price === 'string' ? parseFloat(product.compare_at_price) : product.compare_at_price;

  const discount = compareNum
    ? Math.round(((compareNum - priceNum) / compareNum) * 100)
    : 0;

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <StyledCard>
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="350"
          image={product.main_image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600'}
          alt={product.name}
          className="product-image"
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
        />
        
        {/* Badges */}
        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {showHotBadge && (
            <Chip label="Hot" color="warning" size="small" sx={{ fontWeight: 700 }} />
          )}
          {product.is_featured && (
            <Chip label="Featured" color="secondary" size="small" sx={{ fontWeight: 600 }} />
          )}
          {discount > 0 && (
            <Chip label={`-${discount}%`} color="error" size="small" sx={{ fontWeight: 600 }} />
          )}
        </Box>

        {/* Wishlist Button */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': { backgroundColor: 'white' }
          }}
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
            try {
              // Fire-and-forget
              (addToWishlist as any)({ product_id: product.id });
            } catch {}
          }}
        >
          {isWishlisted ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>

        {/* Action Buttons */}
        <ProductActions className="product-actions">
          <ActionButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              onQuickView?.(product.id);
            }}
          >
            <VisibilityIcon />
          </ActionButton>
          <ActionButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.(product.id);
            }}
          >
            <ShoppingCartIcon />
          </ActionButton>
        </ProductActions>
      </Box>

      <CardContent
        sx={{ 
          flexGrow: 1,
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
          {product.category_name}
        </Typography>
        
        <Typography variant="h6" sx={{ fontWeight: 500, lineHeight: 1.3 }}>
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            ${priceNum.toFixed(2)}
          </Typography>
          {compareNum && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              ${compareNum.toFixed(2)}
            </Typography>
          )}
        </Box>
      </CardContent>
    </StyledCard>
    </Link>
  );
}