import React, { useState, useRef } from 'react';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { defectApi } from '../lib/defectApi';
import { useNavigate } from 'react-router-dom';

const Analysis = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const result = await defectApi.detectDefects(file);
      console.log('Detection successful:', result);
      // Navigate to results page with the detection data
      navigate('/results', { state: { result } });
    } catch (err) {
      console.error('Detection failed:', err);
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaperClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
        Solar Panel Detection - YOLOv8
      </Typography>

      <Paper
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handlePaperClick}
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: '#fff',
          border: '2px dashed rgba(255, 215, 0, 0.5)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.05)',
            borderColor: '#FFD700',
          },
          position: 'relative',
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <CloudUploadIcon sx={{ fontSize: 60, color: '#FFD700', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'black', mb: 1 }}>
          {file ? file.name : 'Click or drag and drop your image here'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
          Limit 200MB per file • JPG, PNG, JPEG
        </Typography>
        
        {file && (
          <Box sx={{ mt: 2 }}>
            <img 
              src={URL.createObjectURL(file)} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px', 
                objectFit: 'contain' 
              }} 
            />
          </Box>
        )}
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {file && (
          <Button
            variant="outlined"
            onClick={() => setFile(null)}
            sx={{
              borderColor: '#FFD700',
              color: '#FFD700',
              '&:hover': {
                borderColor: '#FFE55C',
                backgroundColor: 'rgba(255, 215, 0, 0.05)',
              },
            }}
          >
            Clear
          </Button>
        )}
        <Button
          variant="contained"
          disabled={!file || loading}
          onClick={handleUpload}
          sx={{
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
          {loading ? <CircularProgress size={24} /> : 'Upload Image'}
        </Button>
      </Box>

      {error && (
        <Typography variant="body2" sx={{ color: 'red', mt: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default Analysis;