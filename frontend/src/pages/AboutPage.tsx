import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';

export function AboutPage() {
  const [mdx, setMdx] = useState<string>('');
  useEffect(() => {
    fetch('/content/about.mdx').then(r => r.text()).then(setMdx).catch(() => setMdx('# About\nUpdate content at frontend/public/content/about.mdx'));
  }, []);
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h2" sx={{ mb: 3 }}>Giới thiệu</Typography>
      <Box sx={{ lineHeight: 1.8 }}>
        <ReactMarkdown>{mdx}</ReactMarkdown>
      </Box>
    </Container>
  );
}

export default AboutPage;

