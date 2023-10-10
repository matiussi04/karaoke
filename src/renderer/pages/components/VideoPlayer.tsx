import { Card, CardContent, CardMedia, Typography } from '@mui/material';

interface VideoPlayerProps {
  src: string;
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  return (
    <Card>
      <CardMedia component="video" src={src} controls title="Example Video" />
      <CardContent>
        <Typography variant="h6" component="div">
          Video Title
        </Typography>
      </CardContent>
    </Card>
  );
}
