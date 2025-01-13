import pg from "pg";
import dotenv from "dotenv";

const { Pool } = pg;
// type PoolConfig = pg.PoolConfig; // if you also need PoolConfig

dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
  throw new Error('Missing required database environment variables');
}

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  if (!client) {
    console.error("No client available");
    return;
  }
  client.query("SELECT NOW()", (queryErr, result) => {
    release();
    if (queryErr) {
      console.error("Error executing query:", queryErr);
      return;
    }
    // Use result or remove it if not needed
    console.log("Connected to PostgreSQL database, time:", result?.rows[0]);
  });
});

