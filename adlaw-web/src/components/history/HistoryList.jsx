import React from 'react';
import { Box, Typography } from '@mui/material';
import { HistoryCard } from './HistoryCard';

export const HistoryList = ({ defects, onDefectClick }) => {
  if (!defects.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">
          No defect history found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {defects.map((defect) => (
        <HistoryCard
          key={defect.$id}
          defect={defect}
          onClick={() => onDefectClick(defect)}
        />
      ))}
    </Box>
  );
};