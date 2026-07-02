import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Typography, Button, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, TextField,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert, MenuItem,
} from '@mui/material';
import { AddRounded, SearchRounded, EditRounded, DeleteRounded } from '@mui/icons-material';
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

  const fetch = useCallback(async () => {
    try {
      const { data } = await api.get('/tenants', { params: { search: search || undefined } });
      setTenants(data.data || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetch(); }, [fetch]);

  const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const open = (tenant = null) => {
    setEditing(tenant);
    setForm(tenant
      ? { name: tenant.name, slug: tenant.slug, plan: tenant.subscription?.plan || 'basic', maxCommunities: tenant.subscription?.maxCommunities || 1, maxUnitsPerCommunity: tenant.subscription?.maxUnitsPerCommunity || 50 }
      : { name: '', slug: '', plan: 'basic', maxCommunities: 1, maxUnitsPerCommunity: 50 });
    setError('');
    setDialogOpen(true);
  };

  const submit = async () => {
    setError('');
    try {
      if (editing) {
        await api.put(`/tenants/${editing.id}`, { name: form.name, slug: form.slug });
        await api.patch(`/tenants/${editing.id}/subscription`, { plan: form.plan, maxCommunities: +form.maxCommunities, maxUnitsPerCommunity: +form.maxUnitsPerCommunity });
      } else {
        await api.post('/tenants', { name: form.name, slug: form.slug, plan: form.plan, maxCommunities: +form.maxCommunities, maxUnitsPerCommunity: +form.maxUnitsPerCommunity });
      }
      setDialogOpen(false);
      fetch();
    } catch (e) { setError(e.response?.data?.error?.message || 'Error'); }
  };

  const remove = async (id) => {
    if (!window.confirm(t('tenants.confirmDelete'))) return;
    await api.delete(`/tenants/${id}`);
    fetch();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h4">{t('tenants.title')}</Typography>
        <Button variant="contained" startIcon={<AddRounded />} onClick={() => open()}>{t('tenants.add')}</Button>
      </Box>

      <TextField
        placeholder={t('common.search')} size="small" value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, width: { xs: '100%', sm: 280 } }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded fontSize="small" color="action" /></InputAdornment> }}
      />

      <Card sx={{ border: 1, borderColor: 'divider' }}>
        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={24} /></Box>
        ) : tenants.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">{t('tenants.noResults')}</Typography></Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('tenants.name')}</TableCell>
                  <TableCell>{t('tenants.plan')}</TableCell>
                  <TableCell>{t('tenants.status')}</TableCell>
                  <TableCell align="center">{t('tenants.users')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenants.map((tn) => (
                  <TableRow key={tn.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{tn.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{tn.slug}</Typography>
                    </TableCell>
                    <TableCell><Chip label={t(`tenants.plans.${tn.subscription?.plan || 'basic'}`)} size="small" variant="outlined" /></TableCell>
                    <TableCell><Chip label={t(`tenants.statuses.${tn.status}`)} size="small" color={tn.status === 'active' ? 'success' : 'default'} /></TableCell>
                    <TableCell align="center">{tn._count?.users || 0}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => open(tn)}><EditRounded fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={() => remove(tn.id)}><DeleteRounded fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editing ? t('common.edit') : t('tenants.add')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label={t('tenants.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, ...(!editing && { slug: slug(e.target.value) }) })} required />
            <TextField label={t('tenants.identifier')} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required helperText={t('tenants.identifierHelp')} />
            <TextField label={t('tenants.plan')} value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} select>
              <MenuItem value="basic">{t('tenants.plans.basic')}</MenuItem>
              <MenuItem value="standard">{t('tenants.plans.standard')}</MenuItem>
              <MenuItem value="premium">{t('tenants.plans.premium')}</MenuItem>
            </TextField>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label={t('tenants.maxCommunities')} type="number" value={form.maxCommunities} onChange={(e) => setForm({ ...form, maxCommunities: e.target.value })} fullWidth />
              <TextField label={t('tenants.maxUnits')} type="number" value={form.maxUnitsPerCommunity} onChange={(e) => setForm({ ...form, maxUnitsPerCommunity: e.target.value })} fullWidth />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={submit} disabled={!form.name || !form.slug}>{editing ? t('common.save') : t('common.create')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
