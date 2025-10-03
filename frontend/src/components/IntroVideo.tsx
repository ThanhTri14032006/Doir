import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface IntroVideoProps {
  src?: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
}

export function IntroVideo({ src, poster, autoPlay = true, muted = true }: IntroVideoProps) {
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2, boxShadow: '0 12px 32px rgba(0,0,0,0.2)' }}>
      <Box
        component="video"
        src={src || '/intro.mp4'}
        poster={poster || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200'}
        controls
        autoPlay={autoPlay}
        muted={muted}
        playsInline
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
      {!src && (
        <Typography variant="caption" sx={{ position: 'absolute', bottom: 8, right: 12, color: 'white', opacity: 0.8 }}>
          Replace /intro.mp4 with your intro video
        </Typography>
      )}
    </Box>
  );
}

export default IntroVideo;

