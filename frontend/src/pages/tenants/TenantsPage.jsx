import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  MenuItem,
} from '@mui/material';
import {
  AddRounded,
  SearchRounded,
  EditRounded,
  DeleteRounded,
} from '@mui/icons-material';
import api from '../../services/api';

export default function TenantsPage() {
  const { t } = useTranslation();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ name: '', slug: '', plan: 'basic', maxCommunities: 1, maxUnitsPerCommunity: 50 });

  const fetchTenants = useCallback(async () => {
    try {
      const { data } = await api.get('/tenants', { params: { search: search || undefined } });
      setTenants(data.data || []);
    } catch (err) {
      console.error('Failed to fetch tenants', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', slug: '', plan: 'basic', maxCommunities: 1, maxUnitsPerCommunity: 50 });
    setError('');
    setDialogOpen(true);
  };

  const openEdit = (tenant) => {
    setEditing(tenant);
    setForm({
      name: tenant.name,
      slug: tenant.slug,
      plan: tenant.subscription?.plan || 'basic',
      maxCommunities: tenant.subscription?.maxCommunities || 1,
      maxUnitsPerCommunity: tenant.subscription?.maxUnitsPerCommunity || 50,
    });
    setError('');
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setError('');
    try {
      if (editing) {
        await api.put(`/tenants/${editing.id}`, { name: form.name, slug: form.slug });
        await api.patch(`/tenants/${editing.id}/subscription`, {
          plan: form.plan,
          maxCommunities: parseInt(form.maxCommunities, 10),
          maxUnitsPerCommunity: parseInt(form.maxUnitsPerCommunity, 10),
        });
      } else {
        await api.post('/tenants', {
          name: form.name,
          slug: form.slug,
          plan: form.plan,
          maxCommunities: parseInt(form.maxCommunities, 10),
          maxUnitsPerCommunity: parseInt(form.maxUnitsPerCommunity, 10),
        });
      }
      setDialogOpen(false);
      fetchTenants();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/tenants/${id}`);
      fetchTenants();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const statusColor = (status) => {
    if (status === 'active') return 'success';
    if (status === 'suspended') return 'warning';
    return 'default';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">{t('tenants.title')}</Typography>
        <Button variant="contained" startIcon={<AddRounded />} onClick={openCreate}>
          {t('tenants.createNew')}
        </Button>
      </Box>

      {/* Search */}
      <TextField
        placeholder={t('common.search')}
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, width: { xs: '100%', sm: 300 } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRounded fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Table */}
      <Card>
        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={28} />
          </Box>
        ) : tenants.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">{t('common.noResults')}</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('tenants.name')}</TableCell>
                  <TableCell>{t('tenants.slug')}</TableCell>
                  <TableCell>{t('tenants.plan')}</TableCell>
                  <TableCell>{t('tenants.status')}</TableCell>
                  <TableCell align="center">{t('tenants.communities')}</TableCell>
                  <TableCell align="center">{t('tenants.users')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{tenant.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{tenant.slug}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={t(`tenants.plan${(tenant.subscription?.plan || 'basic').charAt(0).toUpperCase() + (tenant.subscription?.plan || 'basic').slice(1)}`)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={t(`common.${tenant.status}`)} size="small" color={statusColor(tenant.status)} />
                    </TableCell>
                    <TableCell align="center">{tenant._count?.communities || 0}</TableCell>
                    <TableCell align="center">{tenant._count?.users || 0}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => openEdit(tenant)}>
                        <EditRounded fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(tenant.id)} color="error">
                        <DeleteRounded fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? t('common.edit') : t('tenants.createNew')}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              fullWidth
              label={t('tenants.name')}
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value, slug: editing ? form.slug : generateSlug(e.target.value) });
              }}
              required
            />

            <TextField
              fullWidth
              label={t('tenants.slug')}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              required
              helperText={t('tenants.slugHelp')}
            />

            <TextField
              fullWidth
              label={t('tenants.plan')}
              value={form.plan}
              onChange={(e) => setForm({ ...form, plan: e.target.value })}
              select
            >
              <MenuItem value="basic">{t('tenants.planBasic')}</MenuItem>
              <MenuItem value="standard">{t('tenants.planStandard')}</MenuItem>
              <MenuItem value="premium">{t('tenants.planPremium')}</MenuItem>
            </TextField>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label={t('tenants.maxCommunities')}
                type="number"
                value={form.maxCommunities}
                onChange={(e) => setForm({ ...form, maxCommunities: e.target.value })}
              />
              <TextField
                fullWidth
                label={t('tenants.maxUnits')}
                type="number"
                value={form.maxUnitsPerCommunity}
                onChange={(e) => setForm({ ...form, maxUnitsPerCommunity: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!form.name || !form.slug}>
            {editing ? t('common.save') : t('common.create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
