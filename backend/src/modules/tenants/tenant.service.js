const prisma = require('../../config/database');
const { NotFoundError, ConflictError, BadRequestError } = require('../../shared/errors/app-error');

/**
 * List all tenants with pagination (super admin only)
 */
async function list({ page, limit, skip, search, status }) {
  const where = { deletedAt: null };

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [tenants, total] = await Promise.all([
    prisma.tenant.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: {
          select: { plan: true, maxCommunities: true, maxUnitsPerCommunity: true, expiresAt: true },
        },
        _count: { select: { communities: true, users: true } },
      },
    }),
    prisma.tenant.count({ where }),
  ]);

  return { tenants, total };
}

/**
 * Get a single tenant by ID
 */
async function getById(id) {
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: {
      subscription: true,
      _count: { select: { communities: true, users: true } },
    },
  });

  if (!tenant || tenant.deletedAt) {
    throw new NotFoundError('Tenant not found');
  }

  return tenant;
}

/**
 * Create a new tenant with subscription
 */
async function create({ name, slug, plan, maxCommunities, maxUnitsPerCommunity }) {
  if (!name || !slug) {
    throw new BadRequestError('Name and slug are required');
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new BadRequestError('Slug must contain only lowercase letters, numbers, and hyphens');
  }

  const existing = await prisma.tenant.findUnique({ where: { slug } });
  if (existing) {
    throw new ConflictError('A tenant with this slug already exists');
  }

  const tenant = await prisma.tenant.create({
    data: {
      name,
      slug,
      subscription: {
        create: {
          plan: plan || 'basic',
          maxCommunities: maxCommunities || 1,
          maxUnitsPerCommunity: maxUnitsPerCommunity || 50,
        },
      },
    },
    include: { subscription: true },
  });

  return tenant;
}

/**
 * Update tenant details
 */
async function update(id, data) {
  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant || tenant.deletedAt) {
    throw new NotFoundError('Tenant not found');
  }

  // If slug is being updated, check uniqueness
  if (data.slug && data.slug !== tenant.slug) {
    if (!/^[a-z0-9-]+$/.test(data.slug)) {
      throw new BadRequestError('Slug must contain only lowercase letters, numbers, and hyphens');
    }
    const existing = await prisma.tenant.findUnique({ where: { slug: data.slug } });
    if (existing) {
      throw new ConflictError('A tenant with this slug already exists');
    }
  }

  const updated = await prisma.tenant.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      status: data.status,
    },
    include: { subscription: true },
  });

  return updated;
}

/**
 * Update subscription for a tenant
 */
async function updateSubscription(tenantId, { plan, maxCommunities, maxUnitsPerCommunity, expiresAt }) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { subscription: true },
  });

  if (!tenant || tenant.deletedAt) {
    throw new NotFoundError('Tenant not found');
  }

  if (!tenant.subscription) {
    // Create subscription if missing
    const sub = await prisma.subscription.create({
      data: {
        tenantId,
        plan: plan || 'basic',
        maxCommunities: maxCommunities || 1,
        maxUnitsPerCommunity: maxUnitsPerCommunity || 50,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    return sub;
  }

  const updated = await prisma.subscription.update({
    where: { id: tenant.subscription.id },
    data: {
      plan,
      maxCommunities,
      maxUnitsPerCommunity,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    },
  });

  return updated;
}

/**
 * Soft-delete a tenant
 */
async function remove(id) {
  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant || tenant.deletedAt) {
    throw new NotFoundError('Tenant not found');
  }

  await prisma.tenant.update({
    where: { id },
    data: { deletedAt: new Date(), status: 'cancelled' },
  });
}

module.exports = { list, getById, create, update, updateSubscription, remove };
