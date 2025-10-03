import { Box, Container, Typography, Stack, Card, CardContent, Grid, Chip, Paper } from '@mui/material';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HistoryIcon from '@mui/icons-material/History';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function AppPreview() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="xl" sx={{ flex: 1, py: 8 }}>
        <Stack spacing={6} alignItems="center">
          <Box sx={{ textAlign: 'center' }}>
            <Chip 
              label="🔍 ENHANCED SEARCH" 
              color="secondary" 
              sx={{ mb: 2, fontWeight: 600 }}
            />
            <Typography variant="h1" align="center" gutterBottom>
              Dior Fashion E-Commerce
            </Typography>
            <Typography variant="h4" align="center" color="text.secondary" sx={{ mb: 2 }}>
              Advanced Product Search & Discovery
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
              <Chip icon={<SearchIcon />} label="Smart Search" size="small" />
              <Chip icon={<TrendingUpIcon />} label="Autocomplete" size="small" />
              <Chip icon={<HistoryIcon />} label="Search History" size="small" />
              <Chip icon={<FilterListIcon />} label="Advanced Filters" size="small" />
            </Stack>
          </Box>

          <Grid container spacing={3} sx={{ maxWidth: 'lg' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    🔍 Smart Search Features
                  </Typography>
                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon fontSize="small" />
                      <Typography variant="body2">Autocomplete suggestions</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon fontSize="small" />
                      <Typography variant="body2">Search history tracking</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon fontSize="small" />
                      <Typography variant="body2">Popular searches display</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon fontSize="small" />
                      <Typography variant="body2">Real-time filtering</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon fontSize="small" />
                      <Typography variant="body2">Smart product suggestions</Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    🎯 Advanced Filters
                  </Typography>
                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon fontSize="small" />
                      <Typography variant="body2">Price range slider</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon fontSize="small" />
                      <Typography variant="body2">Category multi-select</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon fontSize="small" />
                      <Typography variant="body2">Color & size filters</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon fontSize="small" />
                      <Typography variant="body2">Rating filter</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon fontSize="small" />
                      <Typography variant="body2">Availability options</Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ p: 4, maxWidth: 'lg', width: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              ✨ New Search Features
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      📝 Autocomplete Suggestions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get instant product suggestions as you type with smart filtering
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      🕒 Search History
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quick access to your recent searches with localStorage persistence
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      🔥 Popular Searches
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Discover trending products with clickable search chips
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      🎨 Advanced Filters
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Filter by price, category, color, size, rating, and availability
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      📊 Search Results Page
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dedicated page with grid/list view toggle and sorting options
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      💾 Persistent State
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Search history saved in localStorage for better UX
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'grey.50', borderRadius: 2, width: '100%', maxWidth: 'md' }}>
            <Typography variant="h6" gutterBottom>
              🎯 Complete Search Solution
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enhanced product discovery with autocomplete, filters, search history, and advanced sorting
            </Typography>
          </Box>
        </Stack>
      </Container>
      <Footer />
    </Box>
  );
}