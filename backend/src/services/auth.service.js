import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { usersRepository } from '../repositories/users.repository.js';
import { badRequest, unauthorized, notFound } from '../utils/apiError.js';

export const authService = {
  /**
   * Generates a signed JWT token
   */
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  },

  /**
   * Automatically initializes default admin credentials if no admin account exists
   */
  async ensureDefaultAdmin() {
    try {
      const adminCount = await usersRepository.countAdmins();
      if (adminCount === 0) {
        console.log('👑 [Auth] No admin found. Seeding default administrative account...');
        const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@mctitoeevents.com';
        const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@McTitoe2026!';
        const defaultName = 'MC Titoe Admin';
        const passwordHash = await bcrypt.hash(defaultPassword, 10);

        const newAdmin = await usersRepository.create({
          email: defaultEmail,
          passwordHash,
          fullName: defaultName,
          role: 'admin',
          phone: '+254700000000',
        });
        console.log(`✅ [Auth] Default admin established: ${newAdmin.email}`);
        return newAdmin;
      }
    } catch (err) {
      console.error('⚠️ [Auth] Error ensuring default admin:', err.message);
    }
  },

  /**
   * Authenticate admin credentials and generate JWT token
   */
  async login(email, password) {
    if (!email || !password) {
      throw badRequest('Email and password are required.');
    }

    // Auto-seed if database is completely empty of admins
    await this.ensureDefaultAdmin();

    const user = await usersRepository.findByEmail(email);
    if (!user) {
      throw unauthorized('Invalid email or password.');
    }

    if (!user.password_hash) {
      throw unauthorized('Account does not have password credentials configured.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw unauthorized('Invalid email or password.');
    }

    if (user.role !== 'admin' && user.role !== 'staff') {
      throw unauthorized('Access denied. Administrator privileges required.');
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        phone: user.phone,
      },
      token,
    };
  },

  /**
   * Get current authenticated user profile
   */
  async getProfile(userId) {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw notFound('Administrator account not found.');
    }
    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      phone: user.phone,
      createdAt: user.created_at,
    };
  }
};
