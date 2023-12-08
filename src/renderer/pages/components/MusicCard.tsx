import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import React from 'react';
import discoImage from '../../../../assets/images/disco.jpg';

interface MusicCardInterface {
  musicName: string;
  artist: string;
  isSelected: boolean;
  innerRef: React.RefObject<HTMLDivElement> | null;
}

export default function MusicCard({
  musicName,
  artist,
  isSelected,
  innerRef,
}: MusicCardInterface) {
  return (
    <Card
      sx={{
        display: 'flex',
        borderRadius: 0,
        color: isSelected ? 'red' : 'black',
        boxShadow: 'none',
      }}
      ref={innerRef}
    >
      <CardMedia
        component="img"
        sx={{ width: 80, objectFit: 'contain' }}
        alt={musicName}
        image={discoImage}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {musicName}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {artist}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}
