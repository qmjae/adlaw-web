import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider
} from '@mui/material';
import { useLocation } from 'react-router-dom';

const classNameMapping = {
  'single-cell': 'Single Cell',
  'SINGLE-CELL': 'Single Cell',
  'short-circuit': 'Short Circuit',
  'SHORT-CIRCUIT': 'Short Circuit',
  'open-circuit': 'Open Circuit',
  'OPEN-CIRCUIT': 'Open Circuit',
  'substring': 'Bypass Diode Failure',
  'SUBSTRING': 'Bypass Diode Failure',
  'partial-shading': 'Partial Shading',
  'PARTIAL-SHADING': 'Partial Shading'
};

const Results = () => {
  const location = useLocation();
  const { analysisId, imageUrl, results } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get all detections for bounding boxes
  const detections = results?.detections || [];
  console.log('Detections:', detections);
  console.log('First detection class:', detections[0]?.class);

  // Get the highest confidence detection for details
  const selectedDetection = detections.length > 0 
    ? detections.sort((a, b) => b.confidence - a.confidence)[0]
    : null;

  // Early return if no data was passed or no detections found
  if (!location.state || !imageUrl || !results) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, color: '#FFD700' }}>
          Analysis Results
        </Typography>
        <Typography color="error">
          No analysis data available. Please upload and analyze an image first.
        </Typography>
      </Box>
    );
  }

  // Add new check for no detections or invalid image
  if (detections.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, color: '#FFD700' }}>
          Analysis Results
        </Typography>
        <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
            No Solar Panel Defects Detected
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            This could be because:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• The image doesn't contain a solar panel" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• The image quality is too low for analysis" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• The solar panel is in good condition with no visible defects" />
            </ListItem>
          </List>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Please try again with a clear thermal image of a solar panel.
            </Typography>
          </Box>
        </Paper>
        {/* Show the uploaded image for reference */}
        <Paper sx={{ p: 2, mt: 3, maxWidth: 600, mx: 'auto' }}>
          <Typography variant="subtitle1" sx={{ mb: 2, color: '#666' }}>
            Uploaded Image:
          </Typography>
          <Box sx={{ 
            width: '100%',
            position: 'relative',
            paddingTop: '75%', // This creates a 4:3 aspect ratio container
            overflow: 'hidden',
            borderRadius: '4px'
          }}>
            <img
              src={imageUrl}
              alt="Uploaded Image"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#f5f5f5' // Optional: adds a light background
              }}
            />
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700' }}>
        Analysis Results
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress sx={{ color: '#FFD700' }} />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {/* Image Display */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, backgroundColor: '#fff' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
              Analyzed Image
            </Typography>
            <Box 
              sx={{ 
                position: 'relative',
                width: '100%',
                paddingTop: '100%', // This creates a square container
                overflow: 'hidden'
              }}
            >
              <img
                src={imageUrl}
                alt="Analyzed Solar Panel"
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
                onLoad={() => setLoading(false)}
              />
              {!loading && detections.map((detection, index) => {
                const [x1, y1, x2, y2] = detection.bbox;
                
                return (
                  <Box
                    key={index}
                    sx={{
                      position: 'absolute',
                      left: `${(x1 / 640) * 100}%`,
                      top: `${(y1 / 640) * 100}%`,
                      width: `${((x2 - x1) / 640) * 100}%`,
                      height: `${((y2 - y1) / 640) * 100}%`,
                      border: '2px solid red',
                      boxSizing: 'border-box',
                      backgroundColor: 'rgba(255, 0, 0, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                      }
                    }}
                  >
                    <Typography
                      sx={{
                        position: 'absolute',
                        top: '-20px',
                        left: 0,
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {classNameMapping[detection.class.toLowerCase()] || detection.class}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>

        {/* Defect Details - Only show for selected detection */}
        {selectedDetection && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, backgroundColor: '#fff', mb: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#666', fontWeight: 'bold', mb: 1 }}>
                  Defect Type
                </Typography>
                <Typography variant="body1" sx={{ color: '#ff4444', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {classNameMapping[selectedDetection.class] || selectedDetection.class}
                </Typography>
              </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 'bold', mb: 1 }}>
                Severity Level
              </Typography>
              <Typography variant="body1">{selectedDetection?.priority || 'Not specified'}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 'bold', mb: 1 }}>
                Power Loss
              </Typography>
              <Typography variant="body1">{selectedDetection?.powerLoss || 'Not specified'}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 'bold', mb: 1 }}>
                Category
              </Typography>
              <Typography variant="body1">{selectedDetection?.category || 'Not specified'}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 'bold', mb: 1 }}>
                Description
              </Typography>
              <Typography variant="body1">{selectedDetection?.description || 'No description available'}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 'bold', mb: 1 }}>
                Stress Factors
              </Typography>
              {selectedDetection?.stressFactors ? (
                <List dense>
                  {selectedDetection.stressFactors.map((factor, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={factor} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1">No stress factors listed</Typography>
              )}
            </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 'bold', mb: 1 }}>
                  Recommendations
                </Typography>
                {selectedDetection?.recommendations ? (
                  <List dense>
                    {Array.isArray(selectedDetection.recommendations) ? 
                      selectedDetection.recommendations.map((rec, i) => (
                        <ListItem key={i}>
                          <ListItemText primary={rec} />
                        </ListItem>
                      ))
                      :
                      <ListItem>
                        <ListItemText primary={selectedDetection.recommendations} />
                      </ListItem>
                    }
                  </List>
                ) : (
                  <Typography variant="body1">No recommendations available</Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Results;