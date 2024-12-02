import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const Results = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700' }}>
        Analysis Results
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="text.secondary">
              Image with detection results will appear here
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              height: '400px',
            }}
          >
            <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
              Detection Details
            </Typography>
            <Typography color="text.secondary">
              Detection results and statistics will appear here
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Results;