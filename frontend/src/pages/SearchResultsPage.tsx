import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useGetProductsQuery } from '../store/services/productsService';
import { ProductCard } from '../components/ProductCard';
import { AdvancedSearchFilters } from '../components/AdvancedSearchFilters';
import { QuickViewModal } from '../components/QuickViewModal';
import { Toast } from '../components/Toast';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<any>({});
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { data, isLoading } = useGetProductsQuery({
    search: searchQuery,
    sort,
    page,
    limit: 12,
    ...filters
  });

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleAddToCart = (productId: number) => {
    setToastMessage('Product added to cart!');
    setToastOpen(true);
  };

  const handleQuickView = (productId: number) => {
    const product = data?.products?.find((p: any) => p.id === productId);
    setSelectedProduct(product);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1);
  };

  const activeFiltersCount = Object.values(filters).filter(v => 
    Array.isArray(v) ? v.length > 0 : v !== null && v !== 'all'
  ).length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Search Results for "{searchQuery}"
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data?.pagination?.total || 0} products found
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Filters Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <AdvancedSearchFilters onFilterChange={handleFilterChange} />
        </Grid>

        {/* Results Grid */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Toolbar */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ mb: 3 }} 
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              {activeFiltersCount > 0 && (
                <Chip 
                  label={`${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied`}
                  size="small"
                  color="primary"
                  onDelete={() => setFilters({})}
                />
              )}
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={sort} onChange={(e) => setSort(e.target.value)} label="Sort By">
                  <MenuItem value="relevance">Most Relevant</MenuItem>
                  <MenuItem value="created_at">Newest</MenuItem>
                  <MenuItem value="price_asc">Price: Low to High</MenuItem>
                  <MenuItem value="price_desc">Price: High to Low</MenuItem>
                  <MenuItem value="name">Name: A to Z</MenuItem>
                  <MenuItem value="popular">Most Popular</MenuItem>
                </Select>
              </FormControl>

              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newMode) => newMode && setViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="grid">
                  <ViewModuleIcon />
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>

          {/* Results */}
          {isLoading ? (
            <ProductGridSkeleton count={12} />
          ) : data?.products?.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your search or filters
              </Typography>
              <Button variant="contained" onClick={() => setFilters({})}>
                Clear Filters
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {data?.products?.map((product: any) => (
                  <Grid 
                    key={product.id} 
                    size={{ 
                      xs: 12, 
                      sm: viewMode === 'grid' ? 6 : 12, 
                      lg: viewMode === 'grid' ? 4 : 12 
                    }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onQuickView={handleQuickView}
                    />
                  </Grid>
                ))}
              </Grid>

              {data?.pagination && data.pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={data.pagination.totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

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
    </Container>
  );
}