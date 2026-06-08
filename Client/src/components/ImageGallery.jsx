import React, { useEffect, useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Images from './Images';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

function ImageGallery() {
  const { currentUser, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState('');
  const [uploadedImageTitle, setUploadedImageTitle] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isGetImagesError, setIsGetImagesError] = useState(false);
  const [isUploadFailed, setUploadFailed] = useState(false);
  const [searchText, setSearchText] = useState('');

  const getImages = async (search) => {
    try {
      setIsLoading(true);
      const res = await api.get(import.meta.env.VITE_GET_IMAGES, {
        params: { search },
      });
      setImages(res.data);
      setIsGetImagesError(false);
    } catch {
      setIsGetImagesError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      setIsUploading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (data.error) {
        console.error('Cloudinary error:', data.error.message);
        setUploadFailed(true);
        return;
      }
      setUploadedImage(data.secure_url);
      setUploadFailed(false);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadFailed(true);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const uploadImageToDB = async (data) => {
    try {
      await api.post(import.meta.env.VITE_POST_IMAGE_URL, data);
      setUploadedImage('');
      setUploadedImageTitle('');
      setUploadFailed(false);
      getImages(searchText);
    } catch {
      setUploadFailed(true);
      setUploadedImage('');
      setUploadedImageTitle('');
    }
  };

  const deleteImage = async (id) => {
    try {
      await api.delete(`${import.meta.env.VITE_POST_IMAGE_URL}/images/${id}`);
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch {
      // silently ignore — image stays in the list if delete fails
    }
  };

  const handleReset = () => {
    setUploadedImage('');
    setUploadedImageTitle('');
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getImages(searchText);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
          color: 'white',
          py: 4,
          textAlign: 'center',
          boxShadow: 3,
          position: 'relative',
        }}
      >
        <Typography variant="h4" component="h1">
          Image Gallery
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
          Upload, search, and explore your photos
        </Typography>

        {/* User avatar + logout */}
        <Box sx={{ position: 'absolute', top: '50%', right: 20, transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={currentUser?.displayName || currentUser?.email || ''}>
            <Avatar
              src={currentUser?.photoURL || undefined}
              alt={currentUser?.displayName || currentUser?.email}
              sx={{ width: 36, height: 36, bgcolor: 'rgba(255,255,255,0.25)', fontSize: '0.9rem' }}
            >
              {(currentUser?.displayName?.[0] || currentUser?.email?.[0] || '?').toUpperCase()}
            </Avatar>
          </Tooltip>
          <Tooltip title="Sign out">
            <IconButton onClick={logout} size="small" sx={{ color: 'rgba(255,255,255,0.85)', '&:hover': { color: 'white' } }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Control Panel */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            {/* Upload section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt={uploadedImageTitle || 'Preview'}
                  style={{
                    width: 160,
                    height: 120,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '2px solid #1565c0',
                  }}
                />
              ) : (
                <Button
                  onClick={() => fileInputRef.current.click()}
                  variant="outlined"
                  startIcon={isUploading ? <CircularProgress size={16} /> : <AddPhotoAlternateIcon />}
                  disabled={isUploading}
                  sx={{
                    width: 160,
                    height: 120,
                    flexDirection: 'column',
                    gap: 0.5,
                    fontSize: '0.8rem',
                  }}
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              )}

              <TextField
                placeholder="Image title *"
                value={uploadedImageTitle}
                size="small"
                onChange={(e) => setUploadedImageTitle(e.target.value)}
                sx={{ width: 160 }}
              />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                  onClick={() =>
                    uploadImageToDB({
                      imageUrl: uploadedImage,
                      imageText: uploadedImageTitle,
                    })
                  }
                  disabled={!uploadedImage || !uploadedImageTitle}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleReset}
                  disabled={!uploadedImage}
                >
                  Reset
                </Button>
              </Box>
            </Box>

            {/* Search section */}
            <Box sx={{ flexGrow: 1, maxWidth: 420, alignSelf: 'center' }}>
              <TextField
                fullWidth
                placeholder="Search images by title..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchText && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchText('')}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {searchText && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Filtering results for &ldquo;{searchText}&rdquo;
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Alerts */}
        {isGetImagesError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load images. Please check your connection and try again.
          </Alert>
        )}
        {isUploadFailed && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Upload failed. Please try again.
          </Alert>
        )}

        {/* Gallery */}
        <Divider sx={{ mb: 3 }}>
          <Chip
            label={`${images.length} photo${images.length !== 1 ? 's' : ''}`}
            size="small"
            variant="outlined"
          />
        </Divider>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={56} />
          </Box>
        ) : (
          <Images images={images} onDelete={deleteImage} />
        )}
      </Container>
    </Box>
  );
}

export default ImageGallery;
