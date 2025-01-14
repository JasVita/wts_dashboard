import pg from "pg";
import dotenv from "dotenv";

const { Pool } = pg;
type PoolConfig = pg.PoolConfig;

dotenv.config();

const dbConfig: PoolConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
};

// Create a singleton pool instance
class Database {
  // Instead of Pool, use pg.Pool
  private static instance: pg.Pool;

  public static getInstance(): pg.Pool {
    if (!Database.instance) {
      Database.instance = new Pool(dbConfig);

      Database.instance.on("error", (err: unknown) => {
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
