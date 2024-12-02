import React from 'react';
import { Grid } from '@mui/material';
import { ResultCard } from './ResultCard';

export const ResultsGrid = ({ results }) => {
  return (
    <Grid container spacing={3}>
      {results.map((result, index) => (
        <Grid item xs={12} md={6} key={index}>
          <ResultCard result={result} />
        </Grid>
      ))}
    </Grid>
  );
};