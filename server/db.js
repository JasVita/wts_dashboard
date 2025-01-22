import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
};

// console.log("Database Config:", dbConfig);

export const pool = new Pool(dbConfig);

// Log connection success or failure on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to PostgreSQL database:", err.message);
  } else {
    console.log("Successfully connected to PostgreSQL database");
    release();
  }
});

/**
 * Reusable function to execute SQL queries against our database
 */
export async function executeQuery(query, params = []) {
  const client = await pool.connect();
  try {
    return await client.query(query, params);
  } catch (error) {
    console.error("Database Query Error:", error.message);
    throw error;
  } finally {
    client.release();
  }
}
