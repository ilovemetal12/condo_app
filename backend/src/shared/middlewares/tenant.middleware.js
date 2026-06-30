const { ForbiddenError } = require('../errors/app-error');

/**
 * Ensures the authenticated user can only access their own tenant's data.
 * Attaches tenantId to req for downstream use.
 *
 * Super admins (role = 'super_admin') bypass tenant filtering.
 */
function enforceTenant(req, res, next) {
  const { tenantId, role } = req.user;

  if (role === 'super_admin') {
    // Super admins can operate across tenants via query param or body
    req.tenantId = req.params.tenantId || req.query.tenantId || req.body.tenantId || null;
    return next();
  }

  if (!tenantId) {
    return next(new ForbiddenError('No tenant associated with this user'));
  }

  req.tenantId = tenantId;
  next();
}

module.exports = { enforceTenant };
