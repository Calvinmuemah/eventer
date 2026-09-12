import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { usersRepository } from '../repositories/users.repository.js';
import { unauthorized, forbidden } from '../utils/apiError.js';

export const requireAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw unauthorized('Authentication required. Missing Bearer token.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw unauthorized('Authentication token missing.');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw unauthorized('Authentication token expired. Please sign in again.');
      }
      throw unauthorized('Invalid authentication token.');
    }

    const user = await usersRepository.findById(decoded.id);
    if (!user) {
      throw unauthorized('Account does not exist or has been revoked.');
    }

    if (user.role !== 'admin' && user.role !== 'staff') {
      throw forbidden('Access denied. Administrator privileges required.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
