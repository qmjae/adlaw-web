import React, { useEffect, useState } from 'react';
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
import { defectService, userService } from '../lib/appwrite';

const Results = () => {
  const location = useLocation();
  const { analysisId, imageUrl, results } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the detections from the correct path in the results
  const detections = results?.detections || [];

  useEffect(() => {
    saveResults();
  }, []);

  const saveResults = async () => {
    try {
      setLoading(true);
      const currentUser = await userService.getCurrentUser();
      
      if (detections.length > 0) {
        await Promise.all(detections.map(detection => 
          defectService.saveDefectData(
            currentUser.$id,
            imageUrl,
            {
              type: detection.class,
              severity: detection.priority || 'Unknown',
              timestamp: new Date().toISOString()
            }
          )
        ));
      }
    } catch (err) {
      console.error('Error saving results:', err);
      setError('Failed to save results to database');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (priority) => {
    if (priority?.includes('Hazardous')) return '#ff4444';
    if (priority?.includes('Warning')) return '#ffbb33';
    return '#00C851';
  };

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
            <Box sx={{ position: 'relative' }}>
              <img
                src={imageUrl}
                alt="Analyzed Solar Panel"
                style={{ 
                  width: '100%',
                  height: 'auto',
                  maxHeight: '500px',
                  objectFit: 'contain'
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Defect Details */}
        <Grid item xs={12} md={6}>
          {detections.map((detection, index) => (
            <Paper key={index} sx={{ p: 2, backgroundColor: '#fff', mb: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 'bold', mb: 1 }}>
                  Priority Level
                </Typography>
                <Typography variant="body1">{detection.priority || 'Not specified'}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 'bold', mb: 1 }}>
                  Power Loss Impact
                </Typography>
                <Typography variant="body1">{detection.powerLoss || 'Not specified'}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 'bold', mb: 1 }}>
                  Category
                </Typography>
                <Typography variant="body1">{detection.category || 'Not specified'}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 'bold', mb: 1 }}>
                  Description
                </Typography>
                <Typography variant="body1">{detection.description || 'No description available'}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 'bold', mb: 1 }}>
                  Stress Factors
                </Typography>
                {detection.stressFactors ? (
                  <List dense>
                    {detection.stressFactors.map((factor, i) => (
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
                {detection.recommendations ? (
                  <List dense>
                    {Array.isArray(detection.recommendations) ? 
                      detection.recommendations.map((rec, i) => (
                        <ListItem key={i}>
                          <ListItemText primary={rec} />
                        </ListItem>
                      ))
                      :
                      <ListItem>
                        <ListItemText primary={detection.recommendations} />
                      </ListItem>
                    }
                  </List>
                ) : (
                  <Typography variant="body1">No recommendations available</Typography>
                )}
              </Box>
            </Paper>
          ))}
        </Grid>

        {/* Processing Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: '#fff' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
              Processing Information
            </Typography>
            <Typography variant="body1">
              <strong>Processing Time:</strong> {results?.processing_time || 'N/A'}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {results?.status || 'N/A'}
            </Typography>
            <Typography variant="body1">
              <strong>Total Detections:</strong> {results?.total_detections || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Results;