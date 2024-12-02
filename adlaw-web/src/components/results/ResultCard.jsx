import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Collapse,
  IconButton,
  styled
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BoundingBox } from './BoundingBox';
import { DefectDetails } from './DefectDetails';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const ResultCard = ({ result }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getSeverityColor = (severity) => {
    const level = parseInt(severity);
    if (level >= 7) return 'error';
    if (level >= 4) return 'warning';
    return 'success';
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ position: 'relative' }}>
          <img
            src={result.imageUrl}
            alt="Analysis result"
            style={{ width: '100%', height: 'auto', borderRadius: 4 }}
          />
          {result.detections?.map((detection, index) => (
            <BoundingBox
              key={index}
              bbox={detection.bbox}
              label={detection.class}
              confidence={detection.confidence}
            />
          ))}
        </Box>

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" component="div">
            {result.detections?.[0]?.class?.replace(/-/g, ' ').toUpperCase() || 'No defect detected'}
          </Typography>
          <Chip
            label={result.detections?.[0]?.priority || 'N/A'}
            color={getSeverityColor(result.detections?.[0]?.priority?.split(' ')[0] || 0)}
            size="small"
          />
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <DefectDetails defect={result.detections?.[0]} />
        </Collapse>
      </CardContent>
    </Card>
  );
};