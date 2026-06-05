import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  CircularProgress,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Image as ImageIcon,
  Create as CreateIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';

export default function Feed() {
  const { user } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All Posts');

  // Fetch initial feed posts
  const fetchFeed = async (pageNumber = 1, append = false) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await axios.get(`/posts?page=${pageNumber}&limit=8`);
      const { posts: fetchedPosts, hasMore: moreAvailable } = response.data;
      
      if (append) {
        setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
      } else {
        setPosts(fetchedPosts);
      }
      setHasMore(moreAvailable);
      setPage(pageNumber);
    } catch (error) {
      console.error('Error fetching feed posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFeed(1, false);
  }, []);

  const handleRefresh = () => {
    setActiveTab('All Posts');
    fetchFeed(1, false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'Most Liked') {
      setPosts((prev) => [...prev].sort((a, b) => b.likes.length - a.likes.length));
    } else if (tab === 'Most Commented') {
      setPosts((prev) => [...prev].sort((a, b) => b.comments.length - a.comments.length));
    } else {
      fetchFeed(1, false);
    }
  };

  // Submit new post
  const handlePostSubmit = async ({ text, image }) => {
    try {
      const response = await axios.post('/posts', { text, image });
      // Put the new post at the top of the feed
      setPosts((prevPosts) => [response.data, ...prevPosts]);
      setActiveTab('All Posts');
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      alert(error.response?.data?.message || 'Error creating post. Please try again.');
      return false;
    }
  };

  // Optimistic Like Handler
  const handleLike = async (postId) => {
    if (!user) return;

    // Save previous state in case of rollback
    const originalPosts = [...posts];

    // Optimistically toggle like in state
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          const username = user.username;
          const likedIndex = post.likes.indexOf(username);
          let newLikes = [...post.likes];

          if (likedIndex > -1) {
            newLikes.splice(likedIndex, 1);
          } else {
            newLikes.push(username);
          }

          return { ...post, likes: newLikes };
        }
        return post;
      })
    );

    try {
      await axios.put(`/posts/${postId}/like`);
    } catch (error) {
      console.error('Error liking post:', error);
      // Rollback to original state on failure
      setPosts(originalPosts);
    }
  };

  // Optimistic Comment Handler
  const handleComment = async (postId, text) => {
    if (!user) return false;

    const originalPosts = [...posts];
    const temporaryCommentId = Math.random().toString(36).substring(7);
    const newComment = {
      _id: temporaryCommentId,
      username: user.username,
      text: text,
      createdAt: new Date().toISOString(),
    };

    // Optimistically add comment to state
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );

    try {
      const response = await axios.post(`/posts/${postId}/comment`, { text });
      
      // Update with actual post data from backend (which includes the saved comment with real DB _id)
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            return response.data;
          }
          return post;
        })
      );
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      // Rollback to original state on failure
      setPosts(originalPosts);
      return false;
    }
  };

  const handleLoadMore = () => {
    fetchFeed(page + 1, true);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: 'calc(100vh - 70px)' }}>
      {/* Quick Create Post Box (LinkedIn inspired) */}
      {user && (
        <Paper
          sx={{
            p: 2.5,
            mb: 4,
            borderRadius: '16px',
            background: 'rgba(30, 41, 59, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
            color: '#f8fafc',
            maxWidth: '680px',
            margin: '0 auto 32px',
          }}
        >
          {/* Header row with Title and Selector (TaskPlanet inspired) */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc' }}>
              Create Post
            </Typography>
            <Box
              sx={{
                display: 'flex',
                background: 'rgba(15, 23, 42, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                p: 0.5,
              }}
            >
              {['All Posts', 'Promotions'].map((type) => (
                <Box
                  key={type}
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: '16px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: type === 'All Posts' ? '#fff' : '#94a3b8',
                    background: type === 'All Posts' ? '#6366f1' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {type}
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                width: 44,
                height: 44,
                fontWeight: 600,
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            
            {/* Clickable fake input box */}
            <Box
              onClick={() => setModalOpen(true)}
              sx={{
                flex: 1,
                background: 'rgba(15, 23, 42, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                py: 1.5,
                px: 2.5,
                color: '#94a3b8',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, background 0.2s ease',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  background: 'rgba(15, 23, 42, 0.6)',
                },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Share something with the community...
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)', my: 1.5 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
            <Button
              startIcon={<ImageIcon sx={{ color: '#ec4899' }} />}
              onClick={() => setModalOpen(true)}
              sx={{
                color: '#cbd5e1',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
              }}
            >
              Photo
            </Button>
            <Button
              startIcon={<CreateIcon sx={{ color: '#6366f1' }} />}
              onClick={() => setModalOpen(true)}
              sx={{
                color: '#cbd5e1',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
              }}
            >
              Write Post
            </Button>
          </Box>
        </Paper>
      )}

      {/* Feed Title and Refresh Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '680px',
          margin: '0 auto 20px',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', letterSpacing: '.5px' }}>
          Explore Community Posts
        </Typography>
        <IconButton
          onClick={handleRefresh}
          disabled={loading}
          sx={{
            color: '#94a3b8',
            '&:hover': { color: '#f8fafc' },
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>
      {/* Filter Tabs (TaskPlanet inspired) */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          overflowX: 'auto',
          pb: 2,
          mb: 4,
          maxWidth: '680px',
          margin: '0 auto',
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
        }}
      >
        {['All Posts', 'For You', 'Most Liked', 'Most Commented'].map((tab) => (
          <Button
            key={tab}
            onClick={() => handleTabChange(tab)}
            variant={activeTab === tab ? 'contained' : 'outlined'}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              px: 3,
              py: 0.6,
              background: activeTab === tab ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'rgba(30, 41, 59, 0.3)',
              color: activeTab === tab ? '#fff' : '#cbd5e1',
              borderColor: activeTab === tab ? 'transparent' : 'rgba(255, 255, 255, 0.08)',
              '&:hover': {
                background: activeTab === tab ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)' : 'rgba(30, 41, 59, 0.5)',
                borderColor: activeTab === tab ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            {tab}
          </Button>
        ))}
      </Box>

      {/* Loading state */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress sx={{ color: '#6366f1' }} />
        </Box>
      ) : (
        <Box>
          {posts.length > 0 ? (
            <Box>
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={handleLike}
                  onAddComment={handleComment}
                />
              ))}

              {/* Load More Button */}
              {hasMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 6 }}>
                  <Button
                    variant="outlined"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#cbd5e1',
                      px: 4,
                      py: 1.2,
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#6366f1',
                        background: 'rgba(99, 102, 241, 0.08)',
                        color: '#f8fafc',
                      },
                    }}
                  >
                    {loadingMore ? <CircularProgress size={24} sx={{ color: '#94a3b8' }} /> : 'Load More Posts'}
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Paper
              sx={{
                p: 6,
                borderRadius: '16px',
                background: 'rgba(30, 41, 59, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                color: '#64748b',
                textAlign: 'center',
                maxWidth: '680px',
                margin: '0 auto',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#94a3b8' }}>
                Feed is empty
              </Typography>
              <Typography variant="body2">
                Be the first to share details with the company. Click the box above to write a post!
              </Typography>
            </Paper>
          )}
        </Box>
      )}

      {/* Create Post Dialog Modal */}
      <CreatePostModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handlePostSubmit}
      />
    </Container>
  );
}
