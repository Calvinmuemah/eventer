import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/db/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeeds() {
  console.log('🌱 Running database seeds...');
  const seedsDir = path.join(__dirname, 'seeds');
  const files = fs.readdirSync(seedsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    const filePath = path.join(seedsDir, file);
    console.log(`➡️  Executing seed: ${file}`);
    const sql = fs.readFileSync(filePath, 'utf-8');
    await db.query(sql);
    console.log(`✅  Seeded: ${file}`);
  }

  console.log('🎉 Seeding completed successfully.');
  process.exit(0);
}

runSeeds().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
