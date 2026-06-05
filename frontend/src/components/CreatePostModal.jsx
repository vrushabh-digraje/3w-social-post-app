import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Image as ImageIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';

export default function CreatePostModal({ open, onClose, onSubmit }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [compressing, setCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleClose = () => {
    setText('');
    setImage('');
    setPreview('');
    onClose();
  };

  // Image compressor helper using Canvas
  const compressImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          // Resize logic
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert canvas to jpeg with 0.7 quality to keep document small
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setCompressing(true);
    try {
      const base64Data = await compressImageFile(file);
      setImage(base64Data);
      setPreview(base64Data);
    } catch (error) {
      console.error('Failed to compress image:', error);
      alert('Error processing image. Please try another one.');
    } finally {
      setCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    setImage('');
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    setSubmitting(true);
    const success = await onSubmit({ text: text.trim(), image });
    setSubmitting(false);

    if (success) {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          color: '#f8fafc',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 700,
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          pb: 2,
        }}
      >
        Create a Post
        <IconButton onClick={handleClose} sx={{ color: '#94a3b8', '&:hover': { color: '#f8fafc' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 3 }}>
          {/* Text Input */}
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting}
            sx={{
              '& .MuiInputBase-root': {
                color: '#f8fafc',
                fontSize: '1rem',
                alignItems: 'flex-start',
                p: 0,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
          />

          {/* Image Preview Container */}
          {preview && (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxHeight: '300px',
                overflow: 'hidden',
                borderRadius: '8px',
                mt: 2,
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src={preview}
                alt="Upload preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                }}
              />
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#f43f5e',
                  '&:hover': {
                    background: 'rgba(244, 63, 94, 0.2)',
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}

          {compressing && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2, color: '#94a3b8' }}>
              <CircularProgress size={20} color="inherit" />
              <Typography variant="body2">Optimizing image...</Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: 'space-between',
            px: 3,
            pb: 3,
            pt: 1,
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* File Picker trigger */}
          <Box>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={submitting || compressing}
            />
            <Button
              variant="text"
              startIcon={<ImageIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={submitting || compressing}
              sx={{
                color: '#6366f1',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  background: 'rgba(99, 102, 241, 0.08)',
                },
              }}
            >
              Add Photo
            </Button>
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={(!text.trim() && !image) || submitting || compressing}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
              },
              '&.Mui-disabled': {
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            {submitting ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Post'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
