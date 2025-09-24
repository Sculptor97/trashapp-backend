// Response middleware to standardize API responses
import {
  successResponse,
  errorResponse,
  internalErrorResponse,
} from '../utils/responseUtils.js';

/**
 * Response middleware to standardize all API responses
 * This middleware ensures consistent response structure across all endpoints
 */
export const responseMiddleware = (req, res, next) => {
  // Store original json method
  const originalJson = res.json;

  // Override res.json to standardize response format
  res.json = function (data) {
    // If response is already in standard format, send as is
    if (data && (data.data !== undefined || data.error !== undefined)) {
      return originalJson.call(this, data);
    }

    // If it's an error response, format it properly
    if (res.statusCode >= 400) {
      const errorData = errorResponse(
        data?.message || 'An error occurred',
        data?.code || 'ERROR',
        data?.details || {},
        res.statusCode.toString()
      );
      return originalJson.call(this, errorData);
    }

    // For success responses, wrap in standard format
    const successData = successResponse(data, data?.message || 'Success');

    return originalJson.call(this, successData);
  };

  // Helper methods for controllers
  res.success = function (data, message = 'Success', pagination = null) {
    const response = successResponse(data, message, pagination);
    return this.json(response);
  };

  res.created = function (data, message = 'Created successfully') {
    const response = successResponse(data, message);
    this.status(201);
    return this.json(response);
  };

  res.error = function (
    message,
    code = 'ERROR',
    details = {},
    statusCode = 400
  ) {
    const response = errorResponse(
      message,
      code,
      details,
      statusCode.toString()
    );
    this.status(statusCode);
    return this.json(response);
  };

  res.validationError = function (validationErrors) {
    const response = errorResponse(
      'Validation failed',
      'VALIDATION_ERROR',
      validationErrors,
      '422'
    );
    this.status(422);
    return this.json(response);
  };

  res.notFound = function (resource = 'Resource') {
    const response = errorResponse(
      `${resource} not found`,
      'NOT_FOUND',
      {},
      '404'
    );
    this.status(404);
    return this.json(response);
  };

  res.unauthorized = function (message = 'Unauthorized') {
    const response = errorResponse(message, 'UNAUTHORIZED', {}, '401');
    this.status(401);
    return this.json(response);
  };

  res.forbidden = function (message = 'Forbidden') {
    const response = errorResponse(message, 'FORBIDDEN', {}, '403');
    this.status(403);
    return this.json(response);
  };

  res.internalError = function (message = 'Internal server error') {
    const response = internalErrorResponse(message);
    this.status(500);
    return this.json(response);
  };

  next();
};

/**
 * Error handling middleware
 * Catches all errors and formats them consistently
 */
export const errorHandler = (err, req, res) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const validationErrors = {};
    Object.keys(err.errors).forEach(key => {
      validationErrors[key] = err.errors[key].message;
    });

    return res.validationError(validationErrors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.error(
      `${field} already exists`,
      'DUPLICATE_ERROR',
      { [field]: `${field} must be unique` },
      409
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.unauthorized('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return res.unauthorized('Token expired');
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      details: err.details || {},
    },
    status_code: statusCode.toString(),
  });
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      message: `Route ${req.originalUrl} not found`,
      code: 'NOT_FOUND',
      details: {},
    },
    status_code: '404',
  });
};
