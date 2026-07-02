import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem,
  Divider, ToggleButtonGroup, ToggleButton, useMediaQuery,
} from '@mui/material';
import {
  DashboardRounded, BusinessRounded, MenuRounded,
  DarkModeRounded, LightModeRounded, LogoutRounded,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const W = 240;

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { mode, toggle } = useTheme();
  const nav = useNavigate();
  const loc = useLocation();
  const { t, i18n } = useTranslation();
  const mobile = useMediaQuery('(max-width:900px)');
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);

  const items = [
    { label: t('sidebar.dashboard'), icon: <DashboardRounded />, path: '/' },
    ...(user?.role === 'super_admin' ? [{ label: t('sidebar.tenants'), icon: <BusinessRounded />, path: '/tenants' }] : []),
  ];

  const changeLang = (_, v) => { if (v) { i18n.changeLanguage(v); localStorage.setItem('lang', v); } };

  const sidebar = (
    <Box sx={{ width: W, height: '100%', display: 'flex', flexDirection: 'column', py: 2 }}>
      <Typography variant="h6" sx={{ px: 2.5, mb: 3, fontWeight: 700 }}>CondoSaaS</Typography>
      <List sx={{ flex: 1, px: 1 }}>
        {items.map((it) => (
          <ListItemButton
            key={it.path}
            selected={loc.pathname === it.path}
            onClick={() => { nav(it.path); setOpen(false); }}
            sx={{ borderRadius: 2, mb: 0.5, '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' } } }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{it.icon}</ListItemIcon>
            <ListItemText primary={it.label} primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: loc.pathname === it.path ? 600 : 400 }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      {mobile ? (
        <Drawer open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: W } }}>{sidebar}</Drawer>
      ) : (
        <Box sx={{ width: W, flexShrink: 0, borderRight: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>{sidebar}</Box>
      )}

      {/* Main */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Toolbar variant="dense" sx={{ gap: 1 }}>
            {mobile && <IconButton onClick={() => setOpen(true)}><MenuRounded /></IconButton>}
            <Box sx={{ flex: 1 }} />
            <ToggleButtonGroup size="small" exclusive value={i18n.language} onChange={changeLang} sx={{ '& .MuiToggleButton-root': { px: 0.8, py: 0.2, fontSize: '0.65rem' } }}>
              <ToggleButton value="en">EN</ToggleButton>
              <ToggleButton value="es">ES</ToggleButton>
            </ToggleButtonGroup>
            <IconButton size="small" onClick={toggle}>
              {mode === 'light' ? <DarkModeRounded fontSize="small" /> : <LightModeRounded fontSize="small" />}
            </IconButton>
            <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
              <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: 'primary.main' }}>{user?.firstName?.[0]}</Avatar>
            </IconButton>
            <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} PaperProps={{ sx: { minWidth: 160, mt: 1 } }}>
              <MenuItem disabled><Typography variant="body2">{user?.firstName} {user?.lastName}</Typography></MenuItem>
              <Divider />
              <MenuItem onClick={() => { setAnchor(null); logout(); nav('/login'); }}>
                <LogoutRounded sx={{ mr: 1, fontSize: 18 }} />{t('topbar.signOut')}
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}><Outlet /></Box>
      </Box>
    </Box>
  );
}
