import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'mctitoe_events_designs_jwt_secret_key_2026_super_secure',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    user: (process.env.SMTP_USER || '').trim(),
    pass: (process.env.SMTP_PASS || '').replace(/\s+/g, ''),
    fromName: process.env.EMAIL_FROM_NAME || 'MC TITOE EVENTS AND DESIGNS',
    fromAddress: process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER || 'mctitoeeventsdesigns@gmail.com',
    adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'mctitoeeventsdesigns@gmail.com',
  },
  paystack: {
    secretKey: (process.env.PAYSTACK_SECRET_KEY || '').trim(),
    publicKey: (process.env.PAYSTACK_PUBLIC_KEY || '').trim(),
    currency: (process.env.PAYSTACK_CURRENCY || 'KES').trim().toUpperCase(),
    webhookSecret: (process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY || '').trim(),
  },
};

