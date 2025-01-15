export const env = {
  api: {
    baseUrl: 'http://localhost:5000/api'
  },
  database: {
    host: 'turoidd.c988g8wysqw0.us-east-1.rds.amazonaws.com',
    port: 5432,
    name: 'turoid_test',
    user: 'DBadmin',
    password: 'turoid123!',
    ssl: {
      rejectUnauthorized: false,
      mode: 'require'
    }
  }
};