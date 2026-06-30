const { Router } = require('express');
const tenantController = require('./tenant.controller');
const { authenticate } = require('../../shared/middlewares/auth.middleware');
const { authorize } = require('../../shared/middlewares/role.middleware');

const router = Router();

// All tenant routes require authentication + super_admin role
router.use(authenticate);
router.use(authorize('super_admin'));

router.get('/', tenantController.list);
router.get('/:id', tenantController.getById);
router.post('/', tenantController.create);
router.put('/:id', tenantController.update);
router.patch('/:id/subscription', tenantController.updateSubscription);
router.delete('/:id', tenantController.remove);

module.exports = router;
