import { sendError } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';
  
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('SERVER ERROR [500]:', err);
  } else if (statusCode === 500) {
    console.error(`SERVER ERROR: ${err.message}`);
  }

  // Handle postgres unique constraint violation
  if (err.code === '23505') {
    return sendError(res, 'A record with these details already exists.', { detail: err.detail }, 409);
  }

  // Handle postgres foreign key violation
  if (err.code === '23503') {
    return sendError(res, 'Referenced record was not found.', { detail: err.detail }, 400);
  }

  // Handle postgres invalid UUID
  if (err.code === '22P02') {
    return sendError(res, 'Invalid ID format provided.', null, 400);
  }

  return sendError(res, message, err.details || null, statusCode);
};
