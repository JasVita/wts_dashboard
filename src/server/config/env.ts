export const env = {
  database: {
    host: process.env.DB_HOST || 'wts-db.cb4ygokymibc.ap-southeast-2.rds.amazonaws.com',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'wtsdb',
    user: process.env.DB_USER || 'DBadmin',
    password: process.env.DB_PASSWORD || 'vitalogy123',
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
    cors: {
      origin: process.env.CORS_ORIGIN || '*'
    }
  }
};