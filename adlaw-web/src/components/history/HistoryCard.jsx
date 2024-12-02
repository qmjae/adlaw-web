import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar
} from '@mui/material';
import { format } from 'date-fns';

export const HistoryCard = ({ defect }) => {
  const formatDate = (timestamp) => {
    return format(new Date(timestamp), 'MMM dd, yyyy HH:mm');
  };

  const getSeverityColor = (severity) => {
    if (severity >= 7) return 'error';
    if (severity >= 4) return 'warning';
    return 'success';
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar
            variant="rounded"
            src={defect.imageUrl}
            sx={{ width: 56, height: 56 }}
          />
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="div">
              {defect.defectType.replace(/-/g, ' ').toUpperCase()}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {formatDate(defect.timestamp)}
              </Typography>
              <Chip
                label={`Severity: ${defect.severity}`}
                color={getSeverityColor(defect.severity)}
                size="small"
              />
              <Chip
                label={`Confidence: ${(defect.confidence * 100).toFixed(1)}%`}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};