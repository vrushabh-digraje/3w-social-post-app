import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Container,
  Box,
  Tooltip,
} from '@mui/material';
import {
  BubbleChart as BubbleChartIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useColorMode } from '../main';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toggleColorMode, mode } = useColorMode();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: mode === 'dark' ? 'rgba(15, 23, 42, 0.75)' : 'rgba(248, 250, 252, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: 'none',
        top: 0,
        zIndex: 1100,
        color: mode === 'dark' ? '#f8fafc' : '#0f172a',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              gap: 1.5,
              '&:hover .logo-icon': {
                transform: 'rotate(15deg) scale(1.1)',
              },
            }}
          >
            <BubbleChartIcon
              className="logo-icon"
              sx={{
                fontSize: 32,
                color: mode === 'dark' ? '#6366f1' : '#4f46e5',
                transition: 'transform 0.3s ease',
              }}
            />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontFamily: 'inherit',
                fontWeight: 800,
                letterSpacing: '.5px',
                background: mode === 'dark'
                  ? 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)'
                  : 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              3W Social
            </Typography>
          </Box>

          {/* Navigation Links / User Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}>
              <IconButton
                onClick={toggleColorMode}
                sx={{
                  color: mode === 'dark' ? '#cbd5e1' : '#475569',
                  '&:hover': {
                    background: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)',
                  },
                }}
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tooltip title="Open profile settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      sx={{
                        bg: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        width: 40,
                        height: 40,
                      }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                
                {/* Profile dropdown menu */}
                <Menu
                  sx={{
                    mt: '45px',
                    '& .MuiPaper-root': {
                      background: 'rgba(30, 41, 59, 0.95)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#f8fafc',
                      minWidth: '180px',
                      borderRadius: '12px',
                    },
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem disabled sx={{ opacity: '0.8 !important', py: 1.5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                        {user.username}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                  
                  <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/" sx={{ py: 1.2 }}>
                    <PersonIcon sx={{ mr: 1.5, fontSize: 20, color: '#94a3b8' }} />
                    <Typography textAlign="center">Home Feed</Typography>
                  </MenuItem>
                  
                  <MenuItem onClick={handleLogout} sx={{ py: 1.2, color: '#f43f5e' }}>
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: '#f43f5e' }} />
                    <Typography textAlign="center">Log Out</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: '#94a3b8',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { color: '#f8fafc' },
                  }}
                >
                  Log In
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '8px',
                    px: 3,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
