import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router';
import { useGetProductsQuery } from '../store/services/productsService';
import { ProductCard } from '../components/ProductCard';

export function CollectionsPage() {
  const { data: allProducts } = useGetProductsQuery({ limit: 8, sort: 'created_at' });
  const { data: womenProducts } = useGetProductsQuery({ limit: 8, category: 'women' });
  const { data: menProducts } = useGetProductsQuery({ limit: 8, category: 'men' });

  const renderSection = (title: string, href: string, products: any) => (
    <Box sx={{ mb: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">{title}</Typography>
        <Button component={Link} to={href} variant="text">View all</Button>
      </Stack>
      <Grid container spacing={2}>
        {(products?.products || []).map((p: any) => (
          <Grid item xs={12} sm={6} md={3} key={p.id}>
            <ProductCard product={p} onAddToCart={() => {}} onQuickView={() => {}} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ mb: 4 }}>Collections</Typography>

      {renderSection('Shop', '/products', allProducts)}
      {renderSection('Women', '/products?category=women', womenProducts)}
      {renderSection('Men', '/products?category=men', menProducts)}
    </Container>
  );
}


