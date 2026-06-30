const { Router } = require('express');
const authController = require('./auth.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');

const router = Router();

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getProfile);

module.exports = router;
