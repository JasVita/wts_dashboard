import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
  throw new Error('Missing required database environment variables');
}

export const env = {
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  server: {
    port: parseInt(process.env.PORT || '5000'),
    cors: {
      origin: process.env.CORS_ORIGIN || '*'
    }
  }
};