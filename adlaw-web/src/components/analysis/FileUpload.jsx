import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Box, 
  Paper, 
  Typography,
  List 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FileItem } from './FileItem';

export const FileUpload = ({ files, onFileUpload, onRemoveFile }) => {
  const onDrop = useCallback((acceptedFiles) => {
    onFileUpload(acceptedFiles);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 5
  });

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png'];
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG and PNG files are allowed.');
    }
    
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB.');
    }
    
    return true;
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: isDragActive ? '#f0f8ff' : '#fff',
          border: '2px dashed #ccc',
          cursor: 'pointer',
          mb: 3
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 60, color: '#76c0df' }} />
        <Typography variant="h5" sx={{ mt: 2, color: '#FFD700' }}>
          {isDragActive ? 'Drop files here' : 'Import your image'}
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Click to upload or drag and drop
        </Typography>
      </Paper>

      {files.length > 0 && (
        <List>
          {files.map((file, index) => (
            <FileItem
              key={index}
              file={file}
              onRemove={() => onRemoveFile(index)}
            />
          ))}
        </List>
      )}
    </Box>
  );
};