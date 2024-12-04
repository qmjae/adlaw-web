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
import { defectService } from '../lib/appwrite';

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
      const defects = await defectService.listDefects();
      
      // Process data for visualizations
      const defectCounts = {};
      const severityCounts = {};
      const monthlyData = {};

      defects.documents.forEach(defect => {
        // Count defect types
        defectCounts[defect.defectType] = (defectCounts[defect.defectType] || 0) + 1;
        
        // Count severity levels
        severityCounts[defect.severity] = (severityCounts[defect.severity] || 0) + 1;
        
        // Group by month
        const month = new Date(defect.timestamp).toLocaleString('default', { month: 'long' });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      });

      // Format data for charts
      const defectTypes = Object.entries(defectCounts).map(([name, value]) => ({
        name: name.replace(/-/g, ' ')
                .toUpperCase()
                .split(' ')
                .map(word => word.length > 12 ? `${word.slice(0, 12)}...` : word)
                .join(' '),
        value,
        fullName: name.replace(/-/g, ' ').toUpperCase()
      }));

      const severityDistribution = Object.entries(severityCounts).map(([name, value]) => ({
        name,
        value
      }));

      const timelineData = Object.entries(monthlyData)
        .map(([month, count]) => ({
          month,
          count
        }))
        .sort((a, b) => {
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
          return months.indexOf(a.month) - months.indexOf(b.month);
        });

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
              <PieChart width={500} height={400}>
                <Pie
                  data={data.defectTypes}
                  cx={250}
                  cy={200}
                  labelLine={true}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.defectTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [value, props.payload.fullName]} />
                <Legend verticalAlign="bottom" height={36} />
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