const authService = require('./auth.service');
const { success, created } = require('../../shared/utils/response');

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    return created(res, user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return success(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await authService.getProfile(req.user.userId);
    return success(res, user);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout, getProfile };
