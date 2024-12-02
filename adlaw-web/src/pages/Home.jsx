import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          gap: 4,
        }}
      >
        <img
          src="/assets/adlaw-v2.png"
          alt="Adlaw Logo"
          style={{
            width: '300px',
            height: 'auto',
            animation: 'fadeIn 1s ease-in'
          }}
        />
        
        <Box sx={{ textAlign: 'center', maxWidth: '600px' }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666',
              lineHeight: 1.6,
              fontWeight: 'bold',
            }}
          >
            Adlaw is an advanced solar panel defect detection system that utilizes 
            artificial intelligence technology to identify and analyze potential issues 
            in solar panel installations. Our platform helps maintain optimal 
            performance and longevity of your solar energy systems.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;