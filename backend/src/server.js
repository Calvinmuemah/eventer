import app from './app.js';
import { config } from './config/env.js';
import { pool, testConnection } from './db/index.js';

let server;

if (!process.env.VERCEL) {
  server = app.listen(config.port, async () => {
    console.log(`🚀 EVENTA API server running on port ${config.port} [${config.nodeEnv}]`);
    console.log(`🔗 API Base: http://localhost:${config.port}/api/v1`);
    await testConnection();
  });

  const gracefulShutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Closing HTTP server and PostgreSQL pool...`);
    server.close(async () => {
      try {
        await pool.end();
        console.log('PostgreSQL pool closed. Process terminated cleanly.');
        process.exit(0);
      } catch (err) {
        console.error('Error closing PostgreSQL pool:', err);
        process.exit(1);
      }
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

export default app;
