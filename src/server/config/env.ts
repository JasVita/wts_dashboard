// backend configs
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
    ssl: {
      rejectUnauthorized: false,
    },
  },
  server: {
    port: parseInt(process.env.PORT || '5000'),
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || '*',
    },
  },
  socket: {
    path: '/socket.io',
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || '*',
      methods: ['GET', 'POST', 'OPTIONS'],
      credentials: true,
    },
  },
  whatsapp: {
    apiVersion: process.env.WHATSAPP_API_VERSION,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  },
  api: {
    baseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  },
};
