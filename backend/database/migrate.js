import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/db/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log('🔄 Running database migrations...');
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    console.log(`➡️  Executing migration: ${file}`);
    const sql = fs.readFileSync(filePath, 'utf-8');
    await db.query(sql);
    console.log(`✅  Applied: ${file}`);
  }

  console.log('🎉 All migrations applied successfully.');
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
