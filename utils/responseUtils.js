// Response utilities for consistent API responses
// Matches frontend ApiResponse<T> interface

/**
 * Standard API response structure
 * @param {*} data - Response data
 * @param {string} message - Response message
 * @param {string} statusCode - HTTP status code
 * @param {Object} pagination - Optional pagination info
 * @returns {Object} Standardized API response
 */
export const createResponse = (
  data,
  message,
  statusCode = '200',
  pagination = null
) => {
  const response = {
    data,
    message,
    status_code: statusCode,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return response;
};

/**
 * Success response helper
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {Object} pagination - Optional pagination info
 * @returns {Object} Success response
 */
export const successResponse = (
  data,
  message = 'Success',
  pagination = null
) => {
  return createResponse(data, message, '200', pagination);
};

/**
 * Created response helper (201)
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @returns {Object} Created response
 */
export const createdResponse = (data, message = 'Created successfully') => {
  return createResponse(data, message, '201');
};

/**
 * Error response helper
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {Object} details - Additional error details
 * @param {string} statusCode - HTTP status code
 * @returns {Object} Error response
 */
export const errorResponse = (
  message,
  code = 'ERROR',
  details = {},
  statusCode = '400'
) => {
  return {
    error: {
      message,
      code,
      details,
    },
    status_code: statusCode,
  };
};

/**
 * Validation error response
 * @param {Object} validationErrors - Validation error details
 * @returns {Object} Validation error response
 */
export const validationErrorResponse = validationErrors => {
  return errorResponse(
    'Validation failed',
    'VALIDATION_ERROR',
    validationErrors,
    '422'
  );
};

/**
 * Not found error response
 * @param {string} resource - Resource name
 * @returns {Object} Not found error response
 */
export const notFoundResponse = (resource = 'Resource') => {
  return errorResponse(`${resource} not found`, 'NOT_FOUND', {}, '404');
};

/**
 * Unauthorized error response
 * @param {string} message - Error message
 * @returns {Object} Unauthorized error response
 */
export const unauthorizedResponse = (message = 'Unauthorized') => {
  return errorResponse(message, 'UNAUTHORIZED', {}, '401');
};

/**
 * Forbidden error response
 * @param {string} message - Error message
 * @returns {Object} Forbidden error response
 */
export const forbiddenResponse = (message = 'Forbidden') => {
  return errorResponse(message, 'FORBIDDEN', {}, '403');
};

/**
 * Internal server error response
 * @param {string} message - Error message
 * @returns {Object} Internal server error response
 */
export const internalErrorResponse = (message = 'Internal server error') => {
  return errorResponse(message, 'INTERNAL_ERROR', {}, '500');
};

/**
 * Create pagination object
 * @param {number} currentPage - Current page number
 * @param {number} count - Total count of items
 * @param {number} pageSize - Items per page
 * @returns {Object} Pagination object
 */
export const createPagination = (currentPage, count, pageSize) => {
  const totalPages = Math.ceil(count / pageSize);

  return {
    current_page: currentPage,
    count,
    total_pages: totalPages,
  };
};

/**
 * Create paginated response data
 * @param {Array} items - Array of items
 * @param {Object} pagination - Pagination metadata
 * @returns {Object} Paginated response data
 */
export const createPaginatedData = (items, pagination) => {
  return {
    items,
    pagination,
  };
};

/**
 * Standard HTTP status codes
 */
export const HTTP_STATUS = {
  OK: '200',
  CREATED: '201',
  NO_CONTENT: '204',
  BAD_REQUEST: '400',
  UNAUTHORIZED: '401',
  FORBIDDEN: '403',
  NOT_FOUND: '404',
  CONFLICT: '409',
  UNPROCESSABLE_ENTITY: '422',
  TOO_MANY_REQUESTS: '429',
  INTERNAL_SERVER_ERROR: '500',
  SERVICE_UNAVAILABLE: '503',
};

/**
 * Common error codes
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
};
