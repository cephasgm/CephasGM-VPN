// backend/src/middleware/errorHandler.js

/**
 * Global error handling middleware for Express.
 * Must be used after all routes.
 */
module.exports = (err, req, res, next) => {
  // Log the full error stack to the console (for debugging)
  console.error('❌ Error:', err.stack || err.message || err);

  // Default status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific known error types
  if (err.code === '23505') { // PostgreSQL unique violation
    statusCode = 409;
    message = 'Duplicate entry: ' + (err.constraint || 'resource already exists');
  } else if (err.code === '23503') { // Foreign key violation
    statusCode = 400;
    message = 'Referenced resource does not exist';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.details || 'Validation error';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
  }

  // Send JSON error response
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
