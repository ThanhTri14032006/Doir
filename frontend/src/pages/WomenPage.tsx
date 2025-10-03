import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useGetProductsQuery } from '../store/services/productsService';
import { ProductCard } from '../components/ProductCard';

export function WomenPage() {
  const { data } = useGetProductsQuery({ category: 'women', limit: 12, sort: 'created_at' });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ mb: 4 }}>Women Collection</Typography>

      <Grid container spacing={2}>
        {(data?.products || []).map((p: any) => (
          <Grid item xs={12} sm={6} md={3} key={p.id}>
            <ProductCard product={p} onAddToCart={() => {}} onQuickView={() => {}} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}


