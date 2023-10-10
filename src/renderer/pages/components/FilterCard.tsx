import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import styleImage from '../../../../assets/images/style_image.png';

interface FilterCardInterface {
  filterName: string;
  // eslint-disable-next-line react/require-default-props
  image?: string;
  isSelected: boolean;
}

export default function FilterCard({
  filterName,
  image = styleImage,
  isSelected,
}: FilterCardInterface) {
  return (
    <Card
      sx={{
        display: 'flex',
        borderRadius: 0,
        outline: isSelected ? '5px solid red' : 0,
        boxShadow: 'none',
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 80, objectFit: 'contain' }}
        alt={filterName}
        image={image}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {filterName}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}
