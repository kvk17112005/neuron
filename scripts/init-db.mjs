import { Pool } from '@neondatabase/serverless';
import { readFile } from 'node:fs/promises';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const schema = await readFile(new URL('../supabase-schema.sql', import.meta.url), 'utf8');
  await pool.query(schema);
  console.log('Neon schema applied successfully');
} finally {
  await pool.end();
}
