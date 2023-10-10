import { Box } from '@mui/material';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function ContainerMain({ children }: Props) {
  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f0f0',
      }}
    >
      {children}
    </Box>
  );
}
