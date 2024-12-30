import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
// wts-db.cb4ygokymibc.ap-southeast-2.rds.amazonaws.com
export const pool = new Pool({
  host: process.env.DB_HOST || "wts-db.cb4ygokymibc.ap-southeast-2.rds.amazonaws.com",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "wtsdb",
  user: process.env.DB_USER || "DBadmin",
  password: process.env.DB_PASSWORD || "vitalogy123",
  ssl: {
    rejectUnauthorized: false,
  },
});

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    client.release();
    console.log("Database connection successful:", result.rows[0]);
    return true;
  } catch (err) {
    console.error("Database connection error:", err);
    return false;
  }
};
