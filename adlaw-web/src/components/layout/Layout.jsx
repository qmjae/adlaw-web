import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HomeIcon from '@mui/icons-material/Home';

const drawerWidth = 240;

const menuItems = [
  { text: 'Home', path: '/', icon: <HomeIcon /> },
  { text: 'Analysis', path: '/analysis', icon: <AddIcon /> },
  { text: 'Results', path: '/results', icon: <AssessmentIcon /> },
  { text: 'History', path: '/history', icon: <HistoryIcon /> },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
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
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          gap: 1  // Adds space between logo and text
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
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#76c0df' }}>
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
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#fff',
          minHeight: '100vh',
          color: '#333',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;