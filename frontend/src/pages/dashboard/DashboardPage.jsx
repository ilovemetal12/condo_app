import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const cards = [
    { label: t('dashboard.communities'), value: 0 },
    { label: t('dashboard.units'), value: 0 },
    { label: t('dashboard.residents'), value: 0 },
    { label: t('dashboard.packages'), value: 0 },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>{t('dashboard.welcome', { name: user?.firstName })}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{t('dashboard.subtitle')}</Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {cards.map((c) => (
          <Grid item xs={6} md={3} key={c.label}>
            <Card sx={{ border: 1, borderColor: 'divider' }}>
              <CardContent sx={{ py: 2, px: 2.5, '&:last-child': { pb: 2 } }}>
                <Typography variant="body2" color="text.secondary">{c.label}</Typography>
                <Typography variant="h5" sx={{ mt: 0.5 }}>{c.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ border: 1, borderColor: 'divider', p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>{t('dashboard.emptyTitle')}</Typography>
        <Typography variant="body2" color="text.secondary">{t('dashboard.emptyText')}</Typography>
      </Card>
    </Box>
  );
}
