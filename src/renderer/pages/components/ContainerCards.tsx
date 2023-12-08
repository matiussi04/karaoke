import { Box } from '@mui/material';
import React, { ReactNode } from 'react';

interface Props {
  width: number | string;
  height: number | string;
  children: ReactNode;
  isSelected: boolean;
}

export default function ContainerCards({
  children,
  width,
  height,
  isSelected,
}: Props) {
  return (
    <Box
      sx={{
        width,
        height,
        overflowY: 'hidden',
        marginRight: 5,
        marginLeft: 5,
        borderRadius: 2,
        outline: isSelected ? '5px solid red' : 'none',
        padding: 3,
        background: '#fff',
      }}
    >
      {children}
    </Box>
  );
}
