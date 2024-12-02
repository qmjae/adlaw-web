import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

export const UploadProgress = ({ progress, fileName }) => {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {fileName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {Math.round(progress)}%
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
};