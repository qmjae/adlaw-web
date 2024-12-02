import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Avatar 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff' }}>
      <Toolbar>
        <Box 
          component="img"
          src="/adlaw-logov2.png"
          sx={{ height: 40, mr: 2, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
        
        <Box sx={{ flexGrow: 1 }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/analysis')}
            sx={{ color: '#333' }}
          >
            Analysis
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/history')}
            sx={{ color: '#333' }}
          >
            History
          </Button>
        </Box>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2 }}>{user.username?.[0]}</Avatar>
            <IconButton onClick={handleLogout} color="error">
              <LogoutIcon />
            </IconButton>
          </Box>
        ) : (
          <Button 
            color="primary" 
            variant="contained"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;