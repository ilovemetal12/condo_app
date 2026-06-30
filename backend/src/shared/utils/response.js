/**
 * Standard success response
 */
function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

/**
 * Paginated success response
 */
function paginated(res, data, pagination) {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
}

/**
 * Created response (201)
 */
function created(res, data) {
  return success(res, data, 201);
}

/**
 * No content response (204)
 */
function noContent(res) {
  return res.status(204).send();
}

module.exports = { success, paginated, created, noContent };
