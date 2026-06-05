import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as ChatIcon,
  Send as SendIcon,
} from '@mui/icons-material';

export default function PostCard({ post, onLike, onAddComment }) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [following, setFollowing] = useState(false);

  const isLiked = user ? post.likes.includes(user.username) : false;

  const handleLikeClick = () => {
    if (!user) return;
    onLike(post._id);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    setSubmittingComment(true);
    const success = await onAddComment(post._id, commentText.trim());
    setSubmittingComment(false);

    if (success) {
      setCommentText('');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate tooltip text for likes
  const getLikesTooltipText = () => {
    if (post.likes.length === 0) return 'No likes yet';
    if (post.likes.length <= 5) return `Liked by: ${post.likes.join(', ')}`;
    return `Liked by: ${post.likes.slice(0, 5).join(', ')} and ${post.likes.length - 5} others`;
  };

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto 24px',
        background: 'rgba(30, 41, 59, 0.35)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        color: '#f8fafc',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        transition: 'transform 0.3s ease, border-color 0.3s ease',
        '&:hover': {
          borderColor: 'rgba(255, 255, 255, 0.15)',
        },
      }}
      className="fade-in"
    >
      {/* Header */}
      <CardHeader
        avatar={
          <Avatar
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              color: '#fff',
              fontWeight: 600,
            }}
            aria-label="recipe"
          >
            {post.username ? post.username.charAt(0).toUpperCase() : 'U'}
          </Avatar>
        }
        title={
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f8fafc' }}>
            {post.username}
          </Typography>
        }
        subheader={
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {formatDate(post.createdAt)}
          </Typography>
        }
        action={
          user && user.username !== post.username && (
            <Button
              onClick={() => setFollowing(!following)}
              variant={following ? "outlined" : "contained"}
              size="small"
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.75rem',
                px: 2,
                py: 0.5,
                mr: 1,
                mt: 0.5,
                background: following ? 'transparent' : '#6366f1',
                borderColor: following ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: following ? '#94a3b8' : '#fff',
                '&:hover': {
                  background: following ? 'rgba(255, 255, 255, 0.05)' : '#4f46e5',
                  borderColor: following ? 'rgba(255, 255, 255, 0.4)' : 'transparent',
                }
              }}
            >
              {following ? 'Following' : 'Follow'}
            </Button>
          )
        }
      />

      {/* Post Text */}
      {post.text && (
        <CardContent sx={{ pt: 0, pb: post.image ? 2 : 1.5 }}>
          {/* Post & Earn Badge (TaskPlanet inspired) */}
          {/earn|point|reward|promo/i.test(post.text) && (
            <Box
              sx={{
                display: 'inline-flex',
                background: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                borderRadius: '12px',
                px: 1.5,
                py: 0.4,
                mb: 1.5,
              }}
            >
              <Typography variant="caption" sx={{ color: '#eab308', fontWeight: 800, letterSpacing: '.3px' }}>
                Post & Earn
              </Typography>
            </Box>
          )}
          <Typography
            variant="body1"
            sx={{
              color: '#cbd5e1',
              whiteSpace: 'pre-line',
              fontSize: '0.975rem',
              lineHeight: 1.6,
            }}
          >
            {post.text}
          </Typography>
        </CardContent>
      )}

      {/* Post Image */}
      {post.image && (
        <Box
          sx={{
            width: '100%',
            maxHeight: '450px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
          }}
        >
          <Box
            component="img"
            src={post.image}
            alt="Post content"
            sx={{
              maxWidth: '100%',
              maxHeight: '450px',
              objectFit: 'contain',
              transition: 'transform 0.5s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          />
        </Box>
      )}

      {/* Actions */}
      <CardActions
        disableSpacing
        sx={{
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Like Button */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={getLikesTooltipText()} arrow>
              <IconButton
                onClick={handleLikeClick}
                sx={{
                  color: isLiked ? '#ec4899' : '#94a3b8',
                  transition: 'transform 0.2s ease, color 0.2s ease',
                  '&:hover': {
                    color: '#ec4899',
                    transform: 'scale(1.15)',
                    background: 'rgba(236, 72, 153, 0.08)',
                  },
                }}
              >
                {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ color: '#94a3b8', ml: 0.5, fontWeight: 600 }}>
              {post.likes.length}
            </Typography>
          </Box>

          {/* Comment Count / Button */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleExpandClick}
              sx={{
                color: expanded ? '#6366f1' : '#94a3b8',
                transition: 'transform 0.2s ease, color 0.2s ease',
                '&:hover': {
                  color: '#6366f1',
                  transform: 'scale(1.15)',
                  background: 'rgba(99, 102, 241, 0.08)',
                },
              }}
            >
              <ChatIcon />
            </IconButton>
            <Typography variant="body2" sx={{ color: '#94a3b8', ml: 0.5, fontWeight: 600 }}>
              {post.comments.length}
            </Typography>
          </Box>
        </Box>
      </CardActions>

      {/* Comment Section (Collapsible) */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
        <CardContent sx={{ pb: 3 }}>
          {/* Add Comment Input */}
          {user ? (
            <Box
              component="form"
              onSubmit={handleCommentSubmit}
              sx={{ display: 'flex', gap: 1.5, mb: 3 }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={submittingComment}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(15, 23, 42, 0.3)',
                    color: '#f8fafc',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6366f1',
                    },
                  },
                }}
              />
              <IconButton
                type="submit"
                disabled={!commentText.trim() || submittingComment}
                sx={{
                  color: '#6366f1',
                  alignSelf: 'center',
                  '&.Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', mb: 2 }}>
              Please login to add comments.
            </Typography>
          )}

          {/* Comments List */}
          {post.comments.length > 0 ? (
            <List sx={{ width: '100%', p: 0 }}>
              {post.comments.map((comment, index) => (
                <Box key={comment._id || index}>
                  <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: 44 }}>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#f8fafc',
                          fontSize: '0.75rem',
                        }}
                      >
                        {comment.username ? comment.username.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            component="span"
                            variant="subtitle2"
                            sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.85rem' }}
                          >
                            {comment.username}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ color: '#64748b' }}
                          >
                            {formatDate(comment.createdAt)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#cbd5e1',
                            mt: 0.5,
                            fontSize: '0.875rem',
                            wordBreak: 'break-word',
                          }}
                        >
                          {comment.text}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < post.comments.length - 1 && (
                    <Divider variant="inset" component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.03)', ml: '44px' }} />
                  )}
                </Box>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', my: 2 }}>
              No comments yet. Start the conversation!
            </Typography>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}
