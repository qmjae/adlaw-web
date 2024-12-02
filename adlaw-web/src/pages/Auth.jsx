import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import { userService, account } from '../lib/appwrite';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [tab, setTab] = useState(0); // 0 for login, 1 for register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 0) {
        // Login
        await account.createEmailPasswordSession(formData.email, formData.password);
      } else {
        // Register
        await userService.createUser(
          formData.email,
          formData.password,
          formData.username
        );
        // Auto login after registration
        await account.createEmailPasswordSession(formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#fff'
        }}
      >
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <img
            src="/assets/adlaw-logov2.png"
            alt="Adlaw Logo"
            style={{
              width: '50px',
              height: 'auto',
              marginBottom: '1rem'
            }}
          />
          <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
            Adlaw
          </Typography>
        </Box>

        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          sx={{ mb: 3 }}
          centered
        >
          <Tab 
            label="Login" 
            sx={{ 
              color: tab === 0 ? '#FFD700' : 'inherit',
              '&.Mui-selected': { color: '#FFD700' }
            }}
          />
          <Tab 
            label="Register"
            sx={{ 
              color: tab === 1 ? '#FFD700' : 'inherit',
              '&.Mui-selected': { color: '#FFD700' }
            }}
          />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {tab === 1 && (
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFD700',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#FFD700',
                },
              }}
            />
          )}
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#FFD700',
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#FFD700',
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#FFD700',
              color: 'black',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#FFE55C',
              },
              '&:disabled': {
                backgroundColor: 'rgba(255, 215, 0, 0.3)',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : tab === 0 ? (
              'Login'
            ) : (
              'Register'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Auth;
