const { BadRequestError } = require('../../shared/errors/app-error');

function validateRegister(req, res, next) {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return next(new BadRequestError('email, password, firstName, and lastName are required'));
  }

  if (password.length < 8) {
    return next(new BadRequestError('Password must be at least 8 characters'));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new BadRequestError('Invalid email format'));
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('email and password are required'));
  }

  next();
}

function validateRefresh(req, res, next) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new BadRequestError('refreshToken is required'));
  }

  next();
}

module.exports = { validateRegister, validateLogin, validateRefresh };
