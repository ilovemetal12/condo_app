const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../../config/database');
const env = require('../../config/env');
const { UnauthorizedError, ConflictError, BadRequestError } = require('../../shared/errors/app-error');

/**
 * Register a new user (used by super admin to create users, or self-registration for residents)
 */
async function register({ email, password, firstName, lastName, phone, role, tenantId, communityId }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError('A user with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      role: role || 'resident',
      tenantId: tenantId || null,
      communityId: communityId || null,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      tenantId: true,
      communityId: true,
      createdAt: true,
    },
  });

  return user;
}

/**
 * Authenticate user with email + password, return tokens
 */
async function login(email, password) {
  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { tenant: { select: { id: true, name: true, status: true } } },
  });

  if (!user || user.deletedAt) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Account is deactivated');
  }

  // If user belongs to a tenant, check tenant is active
  if (user.tenant && user.tenant.status !== 'active') {
    throw new UnauthorizedError('Your organization account is suspended');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user.id);

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: user.tenantId,
      communityId: user.communityId,
    },
  };
}

/**
 * Refresh an expired access token using a valid refresh token
 */
async function refresh(refreshTokenValue) {
  if (!refreshTokenValue) {
    throw new BadRequestError('Refresh token is required');
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenValue },
    include: { user: true },
  });

  if (!stored) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  if (stored.expiresAt < new Date()) {
    // Clean up expired token
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    throw new UnauthorizedError('Refresh token expired');
  }

  const { user } = stored;

  if (!user.isActive || user.deletedAt) {
    throw new UnauthorizedError('Account is deactivated');
  }

  // Rotate: delete old, create new
  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const accessToken = generateAccessToken(user);
  const newRefreshToken = await generateRefreshToken(user.id);

  return { accessToken, refreshToken: newRefreshToken };
}

/**
 * Logout: invalidate refresh token
 */
async function logout(refreshTokenValue) {
  if (refreshTokenValue) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshTokenValue } });
  }
}

/**
 * Get current user profile
 */
async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      tenantId: true,
      communityId: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  return user;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      communityId: user.communityId,
    },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
}

async function generateRefreshToken(userId) {
  const token = crypto.randomBytes(64).toString('hex');

  // Parse refresh expiry (e.g. "7d" -> 7 days)
  const daysMatch = env.jwt.refreshExpiresIn.match(/(\d+)d/);
  const days = daysMatch ? parseInt(daysMatch[1], 10) : 7;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: { userId, token, expiresAt },
  });

  return token;
}

module.exports = { register, login, refresh, logout, getProfile };
