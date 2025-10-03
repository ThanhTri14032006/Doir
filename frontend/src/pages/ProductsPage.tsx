import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { useGetProductsQuery, useGetFeaturedProductsQuery } from '../store/services/productsService';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Toast } from '../components/Toast';

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('created_at');
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<{ min_price: number; max_price: number; categories: string[] }>({ min_price: 0, max_price: 5000, categories: [] });
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showHot, setShowHot] = useState(false);

  const category = searchParams.get('category') || '';

  const { data, isLoading } = useGetProductsQuery(useMemo(() => ({
    category,
    search,
    sort,
    page,
    limit: 12,
    min_price: appliedFilters.min_price,
    max_price: appliedFilters.max_price,
    categories: appliedFilters.categories.join(',')
  }), [category, search, sort, page, appliedFilters]));

  const { data: featuredData, isLoading: isLoadingFeatured } = useGetFeaturedProductsQuery(undefined, { skip: !showHot });

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const applyFilters = () => {
    setAppliedFilters({
      min_price: priceRange[0],
      max_price: priceRange[1],
      categories: selectedCategories
    });
    setPage(1);
  };

  useEffect(() => {
    // auto-apply when price slider released on desktops could be implemented with onChangeCommitted below
  }, [priceRange]);

  const handleAddToCart = (_productId: number) => {
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ mb: 4 }}>
        {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : 'All Products'}
      </Typography>

      <Grid container spacing={4} alignItems="flex-start">
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, position: 'sticky', top: 80, zIndex: 1 }}>
            <Typography variant="h6" gutterBottom>Filters</Typography>
            <Divider sx={{ my: 2 }} />

            {/* Categories */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Categories
              </Typography>
              <FormGroup>
                {['Women', 'Men', 'Accessories', 'Bags', 'Shoes'].map((cat) => (
                  <FormControlLabel
                    key={cat}
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(cat.toLowerCase())}
                        onChange={() => handleCategoryToggle(cat.toLowerCase())}
                        size="small"
                      />
                    }
                    label={cat}
                  />
                ))}
              </FormGroup>
            </Box>

            {/* Price Range */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Price Range
              </Typography>
              <Slider
                value={priceRange}
                onChange={(_, newValue) => setPriceRange(newValue as number[])}
                onChangeCommitted={(_, newValue) => setPriceRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={0}
                max={5000}
                step={100}
                sx={{ mt: 2 }}
              />
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                <Typography variant="body2">${priceRange[0]}</Typography>
                <Typography variant="body2">${priceRange[1]}</Typography>
              </Stack>
              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={applyFilters}>Apply</Button>
            </Box>
          </Paper>
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }} alignItems="center">
            <TextField
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={sort} onChange={(e) => setSort(e.target.value)} label="Sort By">
                <MenuItem value="created_at">Newest</MenuItem>
                <MenuItem value="price">Price: Low to High</MenuItem>
                <MenuItem value="name">Name: A to Z</MenuItem>
              </Select>
            </FormControl>
            <Chip
              icon={<WhatshotIcon />}
              label={showHot ? 'Hot products' : 'Show Hot'}
              color={showHot ? 'error' : 'default'}
              variant={showHot ? 'filled' : 'outlined'}
              onClick={() => setShowHot((v) => !v)}
              sx={{ fontWeight: 600 }}
            />
          </Stack>

          {selectedCategories.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mb: 3 }} flexWrap="wrap">
              {selectedCategories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  onDelete={() => handleCategoryToggle(cat)}
                  size="small"
                />
              ))}
            </Stack>
          )}

          {(showHot ? isLoadingFeatured : isLoading) ? (
            <Typography align="center">Loading products...</Typography>
          ) : (
            <>
              <Grid container spacing={3}>
                {(showHot
                  ? (Array.isArray((featuredData as any)?.products) ? (featuredData as any)?.products : (featuredData as any) || [])
                  : (data?.products || [])
                ).map((product: any) => (
                  <Grid key={product.id} item xs={12} sm={6} lg={4}>
                    <ProductCard
                      product={product}
                      showHotBadge={showHot}
                      onAddToCart={handleAddToCart}
                      onQuickView={handleQuickView}
                    />
                  </Grid>
                ))}
              </Grid>

              {!showHot && data?.pagination && data.pagination.totalPages > 1 && (
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