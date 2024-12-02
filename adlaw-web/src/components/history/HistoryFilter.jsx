import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';

export const HistoryFilter = ({ filters, onFilterChange }) => {
  const handleChange = (field) => (event) => {
    onFilterChange({
      ...filters,
      [field]: event.target.value
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Defect Type</InputLabel>
            <Select
              value={filters.defectType}
              label="Defect Type"
              onChange={handleChange('defectType')}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="hot-spot">Hot Spot</MenuItem>
              <MenuItem value="cell-defect">Cell Defect</MenuItem>
              <MenuItem value="diode-failure">Diode Failure</MenuItem>
              <MenuItem value="panel-failure">Panel Failure</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Severity</InputLabel>
            <Select
              value={filters.severity}
              label="Severity"
              onChange={handleChange('severity')}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="high">High (7-10)</MenuItem>
              <MenuItem value="medium">Medium (4-6)</MenuItem>
              <MenuItem value="low">Low (1-3)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};