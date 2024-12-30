import { PoolConfig } from "pg";
import pg from "pg";
const { Pool } = pg;

const dbConfig: PoolConfig = {
  host: "wts-db.cb4ygokymibc.ap-southeast-2.rds.amazonaws.com",
  port: 5432,
  database: "wtsdb",
  user: "DBadmin",
  password: "vitalogy123",
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
