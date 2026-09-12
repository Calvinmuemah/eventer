import { authService } from '../services/auth.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const authController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return sendSuccess(res, 'Authentication successful', result);
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return sendSuccess(res, 'Profile retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      return sendSuccess(res, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }
};
