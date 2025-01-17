// frontend configs
export const env = {
  api: {
    baseUrl: import.meta.env.API_BASE_URL || "http://localhost:5000/api",
  },
  database: {
    host: import.meta.env.DB_HOST,
    port: Number(import.meta.env.DB_PORT) || 5432,
    name: import.meta.env.DB_NAME,
    user: import.meta.env.DB_USER,
    password: import.meta.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
      mode: "require",
    },
  },
};
