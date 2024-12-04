import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { analysisService } from '../lib/appwrite';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    defectTypes: [],
    severityDistribution: [],
    timelineData: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const analyses = await analysisService.listAnalyses();
      
      // Process data for visualizations
      const defectCounts = {};
      const severityCounts = {};
      const monthlyData = {};

      analyses.forEach(analysis => {
        const results = JSON.parse(analysis.results);
        
        // Count defect types
        if (results.detections) {
          results.detections.forEach(detection => {
            defectCounts[detection.class] = (defectCounts[detection.class] || 0) + 1;
            severityCounts[detection.priority] = (severityCounts[detection.priority] || 0) + 1;
          });
        }

        // Group by month
        const month = new Date(analysis.timestamp).toLocaleString('default', { month: 'long' });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      });

      // Format data for charts
      const defectTypes = Object.entries(defectCounts).map(([name, value]) => ({
        name: name.replace(/-/g, ' ').toUpperCase(),
        value
      }));

      const severityDistribution = Object.entries(severityCounts).map(([name, value]) => ({
        name,
        value
      }));

      const timelineData = Object.entries(monthlyData).map(([month, count]) => ({
        month,
        count
      }));

      setData({
        defectTypes,
        severityDistribution,
        timelineData
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Defect Types Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
              Defect Types Distribution
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <PieChart width={400} height={300}>
                <Pie
                  data={data.defectTypes}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.defectTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Box>
          </Paper>
        </Grid>

        {/* Severity Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
              Severity Distribution
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <BarChart
                width={400}
                height={300}
                data={data.severityDistribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </Box>
          </Paper>
        </Grid>

        {/* Monthly Analysis Trend */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
              Monthly Analysis Trend
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <BarChart
                width={800}
                height={300}
                data={data.timelineData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#FFD700" name="Analyses" />
              </BarChart>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;