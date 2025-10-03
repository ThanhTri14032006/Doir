import { Outlet } from 'react-router';
import Box from '@mui/material/Box';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}