import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { useGetCartQuery } from '../store/services/cartService';
import { SearchBar } from './SearchBar';

export function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: cartItems } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const [themeMenuAnchor, setThemeMenuAnchor] = useState<null | HTMLElement>(null);
  const [isDark, setIsDark] = useState<boolean>(() => localStorage.getItem('theme') === 'dark');

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const openThemeMenu = (e: React.MouseEvent<HTMLElement>) => setThemeMenuAnchor(e.currentTarget);
  const closeThemeMenu = () => setThemeMenuAnchor(null);
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleLogout = () => {
    dispatch(logout());
    handleUserMenuClose();
    navigate('/');
  };

  const cartItemCount = cartItems?.length || 0;

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={0} 
      sx={{ 
        borderBottom: '1px solid', 
        borderColor: 'grey.300',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          <Typography
            variant="h4"
            component={Link}
            to="/"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              letterSpacing: '2px',
              mr: 5,
              fontSize: { xs: 28, sm: 32, md: 38 },
              lineHeight: 1.1
            }}
          >
            DIOR
          </Typography>

          <Stack 
            direction="row" 
            spacing={3} 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              '& .MuiButton-root': {
                fontSize: '0.85rem',
                letterSpacing: '0.06em',
                px: 1.25,
                py: 0.5
              }
            }}
          >
            <Button component={Link} to="/products" color="inherit">Shop</Button>
            <Button component={Link} to="/collections" color="inherit">Collections</Button>
            <Button component={Link} to="/women" color="inherit">Women</Button>
            <Button component={Link} to="/men" color="inherit">Men</Button>
            <Button component={Link} to="/about" color="inherit">About</Button>
            <Button component={Link} to="/blog" color="inherit">Blog</Button>
            <Button component={Link} to="/contact" color="inherit">Contact</Button>
          </Stack>

          <Box sx={{ display: { xs: 'none', md: 'block' }, flex: 2, maxWidth: 640, mx: 3 }}>
            <SearchBar />
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton component={Link} to="/wishlist" color="inherit" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
              <Badge badgeContent={0} color="secondary">
                <FavoriteIcon />
              </Badge>
            </IconButton>

            <IconButton component={Link} to="/cart" color="inherit">
              <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <IconButton onClick={openThemeMenu} color="inherit" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
              <SettingsIcon />
            </IconButton>
            <Menu anchorEl={themeMenuAnchor} open={Boolean(themeMenuAnchor)} onClose={closeThemeMenu}>
              <MenuItem onClick={() => { toggleTheme(); closeThemeMenu(); }}>
                {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />} &nbsp; Toggle Theme
              </MenuItem>
            </Menu>

            {isAuthenticated ? (
              <>
                <IconButton onClick={handleUserMenuOpen} color="inherit">
                  <PersonIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem onClick={() => { navigate('/account'); handleUserMenuClose(); }}>
                    Account
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/orders'); handleUserMenuClose(); }}>
                    Orders
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button component={Link} to="/login" color="inherit" sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
                Login
              </Button>
            )}

            <IconButton
              onClick={handleMobileMenuOpen}
              color="inherit"
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>

          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
          >
            <MenuItem onClick={() => { navigate('/products'); handleMobileMenuClose(); }}>
              Shop
            </MenuItem>
            <MenuItem onClick={() => { navigate('/collections'); handleMobileMenuClose(); }}>
              Collections
            </MenuItem>
            <MenuItem onClick={() => { navigate('/about'); handleMobileMenuClose(); }}>
              About
            </MenuItem>
            <MenuItem onClick={() => { navigate('/women'); handleMobileMenuClose(); }}>
              Women
            </MenuItem>
            <MenuItem onClick={() => { navigate('/men'); handleMobileMenuClose(); }}>
              Men
            </MenuItem>
            <MenuItem onClick={() => { navigate('/products?category=accessories'); handleMobileMenuClose(); }}>
              Accessories
            </MenuItem>
            <MenuItem onClick={() => { navigate('/blog'); handleMobileMenuClose(); }}>
              Blog
            </MenuItem>
            <MenuItem onClick={() => { navigate('/contact'); handleMobileMenuClose(); }}>
              Contact
            </MenuItem>
            {!isAuthenticated && (
              <MenuItem onClick={() => { navigate('/login'); handleMobileMenuClose(); }}>
                Login
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}