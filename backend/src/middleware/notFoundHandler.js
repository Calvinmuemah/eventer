import { sendError } from '../utils/apiResponse.js';

export const notFoundHandler = (req, res) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, null, 404);
};
