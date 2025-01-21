import { executeQuery } from './connection.js';

/**
 * List all tables in the current database (within the public schema).
 */
export async function listAllTables() {
  const query = `
    SELECT tablename
    FROM pg_catalog.pg_tables
    WHERE schemaname NOT IN ('pg_catalog', 'information_schema');
  `;

  // Execute the query
  const result = await executeQuery(query);

  // Return rows (list of table names)
  return result.rows; 
}

// Example usage of listAllTables (if you want to test it here):
// (async () => {
//   const tables = await listAllTables();
//   console.log('Tables:', tables);
// })();
