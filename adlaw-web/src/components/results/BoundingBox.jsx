import React from 'react';
import { Box, Typography } from '@mui/material';

export const BoundingBox = ({ bbox, label, confidence }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${bbox[0]}%`,
        top: `${bbox[1]}%`,
        width: `${bbox[2] - bbox[0]}%`,
        height: `${bbox[3] - bbox[1]}%`,
        border: '2px solid #FFD700',
        boxSizing: 'border-box',
        '&::before': {
          content: `"${label} (${(confidence * 100).toFixed(1)}%)"`,
          position: 'absolute',
          top: '-24px',
          left: 0,
          backgroundColor: '#FFD700',
          color: 'black',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap'
        }
      }}
    />
  );
};