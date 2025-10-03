import { Link } from 'react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

export function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'white', pt: 8, pb: 4, mt: 'auto', borderTop: '4px solid', borderColor: 'secondary.main' }}>
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", mb: 2 }}>
              DIOR
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
              Luxury fashion and accessories for the modern individual.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ color: 'white' }} size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ color: 'white' }} size="small">
                <InstagramIcon />
              </IconButton>
              <IconButton sx={{ color: 'white' }} size="small">
                <TwitterIcon />
              </IconButton>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Shop
            </Typography>
            <Stack spacing={1}>
              <Typography
                component={Link}
                to="/products?category=women"
                variant="body2"
                sx={{ color: 'grey.400', textDecoration: 'none', '&:hover': { color: 'white' } }}
              >
                Women
              </Typography>
              <Typography
                component={Link}
                to="/products?category=men"
                variant="body2"
                sx={{ color: 'grey.400', textDecoration: 'none', '&:hover': { color: 'white' } }}
              >
                Men
              </Typography>
              <Typography
                component={Link}
                to="/products?category=accessories"
                variant="body2"
                sx={{ color: 'grey.400', textDecoration: 'none', '&:hover': { color: 'white' } }}
              >
                Accessories
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Customer Service
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                Contact Us
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                Shipping & Returns
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                Size Guide
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                FAQ
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Company
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                About Us
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                Careers
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                Privacy Policy
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400' }}>
                Terms of Service
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: '1px solid', borderColor: 'grey.800', mt: 6, pt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'grey.500' }}>
            © {new Date().getFullYear()} Dior Fashion. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}