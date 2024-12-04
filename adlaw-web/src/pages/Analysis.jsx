import React, { useState, useRef, useCallback } from 'react';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { defectApi } from '../lib/defectApi';
import { analysisService, userService } from '../lib/appwrite';
import { useNavigate } from 'react-router-dom';

const Analysis = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const uploadInProgress = useRef(false);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload an image file (JPG, PNG, or JPEG)');
    }
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload an image file (JPG, PNG, or JPEG)');
    }
  };

  const handleUpload = async () => {
    if (!file || uploadInProgress.current) return;
    
    try {
      uploadInProgress.current = true;
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      const currentUser = await userService.getCurrentUser();
      
      // 1. Upload image to Appwrite storage
      const fileId = await analysisService.uploadImage(file);
      const imageUrl = analysisService.getImageUrl(fileId);
      setUploadProgress(30);

        // 2. Get detection results from your deployed API
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('http://192.168.1.56:8000/detect', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        const apiResult = await response.json();
        setUploadProgress(75);

        // 3. Process and save results
        const processedResults = {
          detections: apiResult.detections,
          processing_time: apiResult.processing_time,
          status: apiResult.status,
          total_detections: apiResult.detections.length
        };

        // Save analysis to history
        const analysis = await analysisService.createAnalysis(
          currentUser.$id,
          imageUrl,
          JSON.stringify({
            timestamp: new Date().toISOString(),
            total_detections: processedResults.total_detections,
            processing_time: processedResults.processing_time,
            status: processedResults.status
          })
        );
        
        setUploadProgress(100);

        // 4. Navigate to results
        navigate('/results', { 
          state: { 
            analysisId: analysis.$id,
            imageUrl,
            results: processedResults
          } 
        });

    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to start upload. Please try again.');
    } finally {
      setLoading(false);
      uploadInProgress.current = false;
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700' }}>
        Solar Panel Defect Analysis
      </Typography>

      <Paper
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
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
          Supported formats: JPG, PNG, JPEG • Max size: 50MB
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

        {loading && (
          <Box sx={{ 
            mt: 2,
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(255, 215, 0, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <Box
              sx={{
                width: `${uploadProgress}%`,
                height: '100%',
                backgroundColor: '#FFD700',
                transition: 'width 0.3s ease'
              }}
            />
          </Box>
        )}
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {file && (
          <Button
            variant="outlined"
            onClick={() => {
              setFile(null);
              setError(null);
            }}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze Image'}
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