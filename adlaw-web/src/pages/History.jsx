import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider
} from '@mui/material';
import { defectService, analysisService, userService } from '../lib/appwrite';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const currentUser = await userService.getCurrentUser();
      
      // Fetch both defects and analysis history
      const [defectsData, analysisData] = await Promise.all([
        defectService.getDefectsByUserId(currentUser.$id),
        analysisService.getAnalysisHistory(currentUser.$id)
      ]);

      // Combine and sort both histories
      const combinedHistory = [
        ...defectsData.documents.map(doc => ({
          ...doc,
          type: 'defect'
        })),
        ...analysisData.documents.map(doc => ({
          ...doc,
          type: 'analysis',
          results: typeof doc.results === 'string' ? JSON.parse(doc.results) : doc.results
        }))
      ].sort((a, b) => 
        new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt)
      );

      setHistory(combinedHistory);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress sx={{ color: '#FFD700' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700' }}>
        Analysis History
      </Typography>

      {history.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No analysis history found</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {history.map((item) => (
            <Grid item xs={12} key={item.$id}>
              <Card sx={{ backgroundColor: '#fff' }}>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={item.type === 'defect' ? item.imageUrl : item.images}
                      alt="Solar Panel Analysis"
                      sx={{ objectFit: 'cover' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                          {item.type === 'defect' 
                            ? item.defectType?.toUpperCase() 
                            : 'Analysis Result'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Analyzed on: {formatDate(item.timestamp || item.createdAt)}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {item.type === 'defect' && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 'bold', mb: 1 }}>
                            Severity Level
                          </Typography>
                          <Chip
                            label={item.severity}
                            color={item.severity?.includes('Hazardous') ? 'error' : 'warning'}
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>
                      )}

                      {item.type === 'analysis' && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ color: '#666', fontWeight: 'bold', mb: 1 }}>
                            Status
                          </Typography>
                          <Chip
                            label={item.status || 'Completed'}
                            color="success"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default History;