import { Box, Typography, Card, CardContent, Grid, Skeleton } from '@mui/material';
import {
  PeopleRounded,
  ApartmentRounded,
  MeetingRoomRounded,
  LocalShippingRounded,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const statCards = [
  {
    label: 'Communities',
    value: '—',
    icon: <ApartmentRounded />,
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    label: 'Units',
    value: '—',
    icon: <MeetingRoomRounded />,
    color: '#0d9488',
    bg: '#f0fdfa',
  },
  {
    label: 'Residents',
    value: '—',
    icon: <PeopleRounded />,
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    label: 'Packages',
    value: '—',
    icon: <LocalShippingRounded />,
    color: '#ea580c',
    bg: '#fff7ed',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          Welcome back, {user?.firstName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your community platform.
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {card.label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      bgcolor: card.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions / Placeholder */}
      <Card>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <ApartmentRounded sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Get started
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
            Create your first community to begin managing units, residents, visitors, and more.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
