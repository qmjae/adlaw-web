import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { account } from '../../lib/appwrite';

const drawerWidth = 240;

const menuItems = [
  { text: 'Home', path: '/', icon: <HomeIcon /> },
  { text: 'Analysis', path: '/analysis', icon: <AddIcon /> },
  { text: 'Results', path: '/results', icon: <AssessmentIcon /> },
  { text: 'History', path: '/history', icon: <HistoryIcon /> },
];

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await account.deleteSession('current');
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#fff',
            color: '#333',
            borderRight: '1px solid #eee',
            height: '100vh',
            position: 'static',
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          borderBottom: '1px solid #eee'
        }}>
          <img
            src="/assets/adlaw-logov2.png"
            alt="Adlaw Logo"
            style={{
              width: '30px',
              height: 'auto',
            }}
          />
          <Typography variant="h6" sx={{ color: '#FFD700' }}>
            Adlaw
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)' }}>
          <List sx={{ flexGrow: 1, py: 0 }}>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  py: 1.5,
                  backgroundColor: location.pathname === item.path ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#76c0df', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: '#333',
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Divider />
          
          <List sx={{ py: 0 }}>
            <ListItem
              button
              onClick={handleSignOut}
              sx={{
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#76c0df', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Sign Out"
                sx={{
                  '& .MuiListItemText-primary': {
                    color: '#333',
                  },
                }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
          p: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;