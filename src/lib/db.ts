import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

// Do not throw while Next.js is collecting modules during a production build.
// A clear error is raised only if a request actually needs the database.
const databaseNotConfigured = () =>
  Promise.reject(new Error('DATABASE_URL is not configured'));

export const sql = databaseUrl
  ? neon(databaseUrl)
  : (databaseNotConfigured as unknown as ReturnType<typeof neon>);
