import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  ApartmentRounded,
  MeetingRoomRounded,
  PeopleRounded,
  LocalShippingRounded,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const stats = [
    {
      label: t('dashboard.communities'),
      value: '0',
      icon: <ApartmentRounded />,
      color: '#4f46e5',
      bg: '#eef2ff',
      bgDark: '#312e81',
    },
    {
      label: t('dashboard.units'),
      value: '0',
      icon: <MeetingRoomRounded />,
      color: '#0891b2',
      bg: '#ecfeff',
      bgDark: '#164e63',
    },
    {
      label: t('dashboard.residents'),
      value: '0',
      icon: <PeopleRounded />,
      color: '#059669',
      bg: '#ecfdf5',
      bgDark: '#064e3b',
    },
    {
      label: t('dashboard.packages'),
      value: '0',
      icon: <LocalShippingRounded />,
      color: '#d97706',
      bg: '#fffbeb',
      bgDark: '#78350f',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          {t('dashboard.welcomeBack', { name: user?.firstName })}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.overview')}
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={(theme) => ({
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: theme.palette.mode === 'light' ? stat.bg : stat.bgDark,
                      color: stat.color,
                    })}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty state */}
      <Card>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t('dashboard.getStarted')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto' }}>
            {t('dashboard.getStartedDesc')}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
