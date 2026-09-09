import net from 'net';
import pg from 'pg';
import { config } from '../config/env.js';

// Ensure IPv4 is prioritized for cloud databases like Neon on Linux systems
if (typeof net.setDefaultAutoSelectFamily === 'function') {
  net.setDefaultAutoSelectFamily(false);
}

const { Pool } = pg;

const isRemoteOrSsl = 
  Boolean(config.databaseUrl) && 
  (config.databaseUrl.includes('neon.tech') || 
   config.databaseUrl.includes('sslmode=require') || 
   config.nodeEnv === 'production');

export function getSafeDbInfo(connectionString) {
  try {
    const url = new URL(connectionString);
    return {
      host: url.hostname,
      port: url.port || 5432,
      database: url.pathname.replace(/^\//, ''),
      ssl: isRemoteOrSsl,
    };
  } catch {
    return {
      host: 'localhost',
      port: 5432,
      database: 'eventa',
      ssl: isRemoteOrSsl,
    };
  }
}

const safeInfo = getSafeDbInfo(config.databaseUrl);

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: isRemoteOrSsl ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Pool Lifecycle Logs
pool.on('connect', (client) => {
  console.log(`🔌 [Database] Client connection established [Host: ${safeInfo.host}:${safeInfo.port}, DB: ${safeInfo.database}] (Active pool connections: ${pool.totalCount})`);
});

pool.on('remove', () => {
  console.log(`🔌 [Database] Client connection released & removed from pool (Remaining in pool: ${pool.totalCount})`);
});

pool.on('error', (err) => {
  console.error(`❌ [Database] Unexpected error on idle PostgreSQL client: ${err.message}`);
});

// Verify connection on startup
export async function testConnection() {
  const start = Date.now();
  try {
    console.log(`⏳ [Database] Attempting connection to ${safeInfo.host}:${safeInfo.port}/${safeInfo.database}...`);
    const res = await pool.query('SELECT NOW() AS server_time, current_database() AS db_name, version() AS version');
    const duration = Date.now() - start;
    const { server_time, db_name, version } = res.rows[0];
    const shortVersion = version ? version.split(' ')[0] + ' ' + version.split(' ')[1] : 'PostgreSQL';

    console.log(`✅ [Database] PostgreSQL connected successfully!`);
    console.log(`   • Host:     ${safeInfo.host}:${safeInfo.port}`);
    console.log(`   • Database: ${db_name}`);
    console.log(`   • Version:  ${shortVersion}`);
    console.log(`   • SSL:      ${isRemoteOrSsl ? 'Enabled' : 'Disabled'}`);
    console.log(`   • Latency:  ${duration}ms`);
    return true;
  } catch (err) {
    console.error(`❌ [Database] Connection failed to ${safeInfo.host}:${safeInfo.port}/${safeInfo.database}`);
    console.error(`   • Error:    ${err.message}`);
    return false;
  }
}

export const db = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
  testConnection,
  getSafeDbInfo,
};

export default db;
