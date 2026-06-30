import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Fade,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  ApartmentRounded,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const DRAWER_WIDTH = 270;

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  ];

  if (user?.role === 'super_admin') {
    menuItems.push({ text: 'Tenants', icon: <BusinessIcon />, path: '/dashboard/tenants' });
  }

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 1 }}>
      {/* Brand */}
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ApartmentRounded sx={{ fontSize: 20, color: 'white' }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
            CondoSaaS
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Management Platform
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2, my: 1 }} />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{ py: 1.2 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive(item.path) ? 600 : 400 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* User card at bottom */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 3,
            bgcolor: '#f8fafc',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.85rem' }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }} noWrap>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ textTransform: 'capitalize' }}>
              {user?.role?.replace('_', ' ')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, bgcolor: 'background.paper' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, bgcolor: 'background.paper' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Toolbar sx={{ gap: 1 }}>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flex: 1 }} />
            <Chip
              label={user?.role?.replace('_', ' ')}
              size="small"
              sx={{ textTransform: 'capitalize', fontWeight: 500, bgcolor: '#eff6ff', color: 'primary.main' }}
            />
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.85rem' }}>
                {user?.firstName?.[0]}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 3 } }}
            >
              <MenuItem disabled sx={{ opacity: '1 !important' }}>
                <PersonIcon sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} /> Sign out
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 3, md: 4 } }}>
          <Fade in timeout={400}>
            <Box>
              <Outlet />
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
}
