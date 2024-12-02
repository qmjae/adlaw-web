import React from 'react';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';

export const DefectDetails = ({ defect }) => {
  if (!defect) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Defect Details
      </Typography>
      
      <List dense>
        <ListItem>
          <ListItemText
            primary="Power Loss"
            secondary={defect.powerLoss}
          />
        </ListItem>
        
        <Divider />
        
        <ListItem>
          <ListItemText
            primary="Category"
            secondary={defect.category}
          />
        </ListItem>
        
        <Divider />
        
        <ListItem>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Stress Factors
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {defect.stressFactors.map((factor, index) => (
                <Chip
                  key={index}
                  label={factor}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </ListItem>
        
        <Divider />
        
        <ListItem>
          <ListItemText
            primary="Description"
            secondary={defect.description}
            secondaryTypographyProps={{ style: { whiteSpace: 'pre-wrap' } }}
          />
        </ListItem>
        
        <Divider />
        
        <ListItem>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Recommendations
            </Typography>
            <List dense>
              {defect.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <Typography variant="body2">• {rec}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        </ListItem>
      </List>
    </Box>
  );
};