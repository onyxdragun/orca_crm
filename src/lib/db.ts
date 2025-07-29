import mariadb, { Pool, Connection } from 'mariadb';

// Define global type for pool caching (for Next.js hot-reload)
const globalForDb = global as unknown as { pool?: Pool };

// Create connection pool (cached in dev)
export const pool =
  globalForDb.pool ||
  mariadb.createPool({
    host: process.env.SQL_HOST || 'host.docker.internal',
    user: process.env.SQL_USER || '',
    password: process.env.SQL_PASS || '',
    database: process.env.SQL_DB || 'orca_crm',
    port: Number(process.env.SQL_PORT) || 3306,
    connectionLimit: 10,
  });

// Cache pool in development to prevent hot-reload issues
if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;

// Helper to get a connection from the pool
export async function getConnection(): Promise<Connection> {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

// Utility to safely serialize BigInts in query results
export function serializeBigInts(obj: unknown) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    )
  );
}
