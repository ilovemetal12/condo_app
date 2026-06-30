const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const { UnauthorizedError } = require('../errors/app-error');

/**
 * Verifies the JWT token from the Authorization header.
 * Attaches decoded user info to req.user.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid authorization header'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
}

module.exports = { authenticate };
