import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Home = () => {
  const steps = [
    {
      icon: <UploadFileIcon sx={{ fontSize: 40, color: '#FFD700' }} />,
      title: 'Upload Solar Panel Image',
      description: 'Upload a high-resolution image of your solar panel. We support JPG, PNG, and JPEG formats up to 50MB.'
    },
    {
      icon: <SearchIcon sx={{ fontSize: 40, color: '#FFD700' }} />,
      title: 'AI Detection',
      description: 'Our AI model analyzes the image to detect various types of defects including single cell, short circuit, open circuit issues, bypass diode issues, and more.'
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 40, color: '#FFD700' }} />,
      title: 'Get Detailed Analysis',
      description: 'Receive comprehensive results showing defect types, and severity levels. View analytics to track patterns over time.'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '80vh',
          gap: 6,
          py: 4
        }}
      >
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', maxWidth: '800px' }}>
          <img
            src="/assets/adlaw-v2.png"
            alt="Adlaw Logo"
            style={{
              width: '300px',
              height: 'auto',
              marginBottom: '2rem',
              animation: 'fadeIn 1s ease-in'
            }}
          />
          
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#333',
              fontWeight: 'bold',
              mb: 2
            }}
          >
            Solar Panel Thermography Analysis System
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666',
              lineHeight: 1.6,
              fontSize: '1.1rem',
              mb: 4
            }}
          >
            Adlaw is an advanced solar panel defect detection system that utilizes 
            artificial intelligence technology to identify and analyze potential issues 
            in solar panel installations. Our platform helps maintain optimal 
            performance and longevity of your solar energy systems.
          </Typography>
        </Box>

        {/* How It Works Section */}
        <Box sx={{ width: '100%' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              textAlign: 'center', 
              color: '#333',
              fontWeight: 'bold',
              mb: 4
            }}
          >
            How It Works
          </Typography>

          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <Box sx={{ mb: 2 }}>{step.icon}</Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#333',
                      mb: 2,
                      fontWeight: 'bold'
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      lineHeight: 1.6
                    }}
                  >
                    {step.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team Section */}
        <Box sx={{ width: '100%', mt: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              textAlign: 'center', 
              color: '#333',
              fontWeight: 'bold',
              mb: 4
            }}
          >
            Meet Our Team
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                name: 'Marlon Jason Ejercito',
                role: 'Frontend/Backend Developer',
                description: 'Computer Engineering Student, specializing in Frontend and Backend Development',
                image: '/assets/team/ejercito.PNG'
              },
              {
                name: 'Christian Andrei Garcia',
                role: 'Backend Developer',
                description: 'Computer Engineering Student, specializing in Backend Development',
                image: '/assets/team/garcia.PNG'
              },
              {
                name: 'Ezekiel Jammuel Manuel',
                role: 'Quality Assurance',
                description: 'Computer Engineering Student, specializing in Quality Assurance',
                image: '/assets/team/manuel.PNG'
              },
              {
                name: 'Jaison Martin Zapanta',
                role: 'Algorithm Developer',
                description: 'Computer Engineering Student, specializing in Algorithm Development',
                image: '/assets/team/zapanta.PNG'
              }
            ].map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 215, 0, 0.05)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      mb: 2,
                      border: '3px solid #FFD700'
                    }}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#333',
                      mb: 1,
                      fontWeight: 'bold'
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: '#FFD700',
                      mb: 1,
                      fontWeight: 'medium'
                    }}
                  >
                    {member.role}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666'
                    }}
                  >
                    {member.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;