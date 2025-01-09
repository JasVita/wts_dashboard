import { Pool, PoolConfig } from "pg";
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: PoolConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Create a singleton pool instance
class Database {
  private static instance: Pool;

  public static getInstance(): Pool {
    if (!Database.instance) {
      Database.instance = new Pool(dbConfig);

      // Add error handling
      Database.instance.on("error", (err) => {
        console.error("Unexpected error on idle client", err);
      });
    }
    return Database.instance;
  }

  public static async testConnection(): Promise<boolean> {
    const pool = Database.getInstance();
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT NOW()");
      client.release();
      console.log("Database connection test successful:", result.rows[0]);
      return true;
    } catch (err) {
      console.error("Database connection test failed:", err);
      return false;
    }
  }
}

export const db = Database.getInstance();
export const testConnection = Database.testConnection;