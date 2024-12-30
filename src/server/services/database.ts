import { Pool } from 'pg';
import { env } from '../config/env';
import { DatabaseError } from '../utils/errors';

class Database {
  private pool: Pool;
  private static instance: Database;

  private constructor() {
    this.pool = new Pool({
      host: env.database.host,
      port: env.database.port,
      database: env.database.name,
      user: env.database.user,
      password: env.database.password,
      ssl: {
        rejectUnauthorized: false,
        mode: 'require'
      }
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query<T>(text: string, params?: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } catch (error) {
      throw new DatabaseError(error instanceof Error ? error.message : 'Unknown database error');
    } finally {
      client.release();
    }
  }
}

export const db = Database.getInstance();