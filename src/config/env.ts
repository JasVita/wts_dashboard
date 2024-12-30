export const env = {
  api: {
    baseUrl: 'http://localhost:3000/api'
  },
  database: {
    host: 'wts-db.cb4ygokymibc.ap-southeast-2.rds.amazonaws.com',
    port: 5432,
    name: 'wtsdb',
    user: 'DBadmin',
    password: 'vitalogy123',
    ssl: {
      rejectUnauthorized: false,
      mode: 'require'
    }
  }
};