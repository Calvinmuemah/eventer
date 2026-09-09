export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const badRequest = (msg, details) => new ApiError(400, msg, details);
export const notFound = (msg = 'Resource not found') => new ApiError(404, msg);
export const conflict = (msg) => new ApiError(409, msg);
export const unprocessable = (msg, details) => new ApiError(422, msg, details);
export const internalError = (msg = 'Internal server error') => new ApiError(500, msg);
