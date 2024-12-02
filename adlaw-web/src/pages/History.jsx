import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

const History = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700' }}>
        Analysis History
      </Typography>

      <Paper
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        <List>
          {/* Example history items - replace with actual data */}
          {[1, 2, 3].map((item) => (
            <React.Fragment key={item}>
              <ListItem
                button
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography color="black">
                      Analysis #{item}
                    </Typography>
                  }
                  secondary={
                    <Typography color="text.secondary" variant="body2">
                      Date: {new Date().toLocaleDateString()}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default History;