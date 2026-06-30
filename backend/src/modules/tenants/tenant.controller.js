const tenantService = require('./tenant.service');
const { success, created, paginated, noContent } = require('../../shared/utils/response');
const { getPagination } = require('../../shared/utils/pagination');

async function list(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search, status } = req.query;

    const { tenants, total } = await tenantService.list({ page, limit, skip, search, status });
    return paginated(res, tenants, { page, limit, total });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const tenant = await tenantService.getById(req.params.id);
    return success(res, tenant);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const tenant = await tenantService.create(req.body);
    return created(res, tenant);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const tenant = await tenantService.update(req.params.id, req.body);
    return success(res, tenant);
  } catch (err) {
    next(err);
  }
}

async function updateSubscription(req, res, next) {
  try {
    const subscription = await tenantService.updateSubscription(req.params.id, req.body);
    return success(res, subscription);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await tenantService.remove(req.params.id);
    return noContent(res);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, updateSubscription, remove };
