import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

// Creating the client is connection-free, so builds can collect route modules
// before Vercel environment variables are configured. Queries still fail
// clearly at request time until DATABASE_URL is supplied.
const connectionString = databaseUrl || 'postgresql://missing:missing@localhost/missing';

export const sql = neon(connectionString);
