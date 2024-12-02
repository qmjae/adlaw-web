import React from 'react';
import { 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Paper 
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';

export const FileItem = ({ file, onRemove }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Paper sx={{ mb: 1, backgroundColor: '#fff' }}>
      <ListItem
        secondaryAction={
          <IconButton edge="end" onClick={onRemove} color="error">
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemIcon>
          <ImageIcon sx={{ color: '#76c0df' }} />
        </ListItemIcon>
        <ListItemText 
          primary={file.name}
          secondary={formatFileSize(file.size)}
        />
      </ListItem>
    </Paper>
  );
};