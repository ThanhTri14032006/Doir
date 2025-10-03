import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export function BlogPage() {
  const [mdx, setMdx] = useState<string>('');
  useEffect(() => {
    fetch('/content/blog.mdx').then(r => r.text()).then(setMdx).catch(() => setMdx('# Blog\nUpdate content at frontend/public/content/blog.mdx'));
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h2" sx={{ mb: 3 }}>Tin tức / Blog</Typography>
      <Box sx={{ lineHeight: 1.8 }}>
        <ReactMarkdown>{mdx}</ReactMarkdown>
      </Box>
    </Container>
  );
}

export default BlogPage;

