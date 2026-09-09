import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalApiLimiter } from './middleware/rateLimiter.js';
import { sendSuccess } from './utils/apiResponse.js';

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 || 
        origin.endsWith('.vercel.app') || 
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing with safe size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Root status endpoints
app.get('/', (req, res) => {
  return sendSuccess(res, 'Eventer API is running', {
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    api: '/api/v1',
  });
});

app.get('/api', (req, res) => {
  return sendSuccess(res, 'Eventer API is running', {
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    api: '/api/v1',
  });
});

// General rate limiter
app.use('/api', generalApiLimiter);

// Mount API v1
app.use('/api/v1', routes);

// 404 handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
