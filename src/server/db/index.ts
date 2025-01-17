import pg from "pg";
// import dotenv from "dotenv";

const { Pool } = pg;
// type PoolConfig = pg.PoolConfig; // if you also need PoolConfig

// dotenv.config();
import { env } from "../../config/env";

// Initialize the connection pool using env.ts
export const pool = new Pool({
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  user: env.database.user,
  password: env.database.password,
  ssl: env.database.ssl, // SSL settings from env.ts
});



// if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
//   throw new Error('[Database] Missing required database environment variables');
// }

// export const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT || "5432"),
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('[Database] Error connecting to the database:', err);
    return;
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      console.error('[Database] Error executing test query:', err);
      return;
    }
    console.log('[Database] Connected to PostgreSQL database:', result.rows[0].now);
  });
});

/**
 * Executes a database query using the connection pool.
 * @param query - The SQL query string.
 * @param params - Optional parameters for the query.
 * @returns Query results as an array of rows.
 */
export const executeQuery = async <T = any>(query: string, params?: any[]): Promise<T[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('[Database] Query error:', error);
    throw new Error(error instanceof Error ? error.message : 'Unknown database error');
  } finally {
    client.release();
  }
};

export default pool;