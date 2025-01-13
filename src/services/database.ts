import pg from "pg";
import { env } from "../config/env";

const { Pool } = pg;

class Database {
  private pool: pg.Pool;
  private static instance: Database;

  private constructor() {
    this.pool = new Pool({
      ...env.database,
      ssl: {
        rejectUnauthorized: false
      }
    });

    this.pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
      process.exit(-1);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export const db = Database.getInstance();

// import { Pool } from 'pg';
// import { env } from '../config/env';

// class Database {
//   private pool: Pool;
//   private static instance: Database;

//   private constructor() {
//     this.pool = new Pool({
//       ...env.database,
//       ssl: env.database.ssl
//     });

//     this.pool.on('error', (err) => {
//       console.error('Unexpected error on idle client', err);
//       process.exit(-1);
//     });
//   }

//   public static getInstance(): Database {
//     if (!Database.instance) {
//       Database.instance = new Database();
//     }
//     return Database.instance;
//   }

//   public async query<T = any>(text: string, params?: any[]): Promise<T[]> {
//     const client = await this.pool.connect();
//     try {
//       const result = await client.query(text, params);
//       return result.rows;
//     } catch (error) {
//       console.error('Database query error:', error);
//       throw error;
//     } finally {
//       client.release();
//     }
//   }
// }

// export const db = Database.getInstance();