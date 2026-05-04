import React, { useEffect, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Box, Container, IconButton, ImageListItemBar, Typography } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import DeleteIcon from '@mui/icons-material/Delete';
import imageGalleryStyles from '../styles.js';

function Images({ images, onDelete }) {
  const classes = imageGalleryStyles();

  const getColumns = (width) => {
    if (width < 600) return 2;
    if (width < 960) return 3;
    if (width < 1280) return 4;
    if (width < 1920) return 5;
    return 6;
  };

  const [columns, setColumns] = useState(getColumns(window.innerWidth));

  useEffect(() => {
    const updateDimensions = () => setColumns(getColumns(window.innerWidth));
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (images.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
        <CollectionsIcon sx={{ fontSize: 80, opacity: 0.2, display: 'block', mx: 'auto', mb: 2 }} />
        <Typography variant="h6" sx={{ opacity: 0.4, fontWeight: 500 }}>
          No photos yet
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.35, mt: 0.5 }}>
          Upload your first image to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Container disableGutters>
      <ImageList className={classes.imageList} cols={columns} gap={12} rowHeight={220}>
        {images.map((item) => (
          <ImageListItem key={item._id || item.imageUrl}>
            <Box
              sx={{
                position: 'relative',
                '&:hover .delete-btn': { opacity: 1 },
              }}
            >
              <a className={classes.a_link} href={item.imageUrl} target="_blank" rel="noopener noreferrer">
                <img
                  className={classes.image}
                  src={`${item.imageUrl}?w=400&auto=format`}
                  srcSet={`${item.imageUrl}?w=400&auto=format&dpr=2 2x`}
                  alt={item.imageText}
                  loading="lazy"
                />
              </a>
              <IconButton
                className="delete-btn"
                size="small"
                onClick={() => onDelete(item._id)}
                sx={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  bgcolor: 'rgba(0,0,0,0.55)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(211,47,47,0.85)' },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              <ImageListItemBar title={item.imageText} position="below" />
            </Box>
          </ImageListItem>
        ))}
      </ImageList>
    </Container>
  );
}

export default Images;
