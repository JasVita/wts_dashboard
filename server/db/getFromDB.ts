// getFromDB.ts
import { executeQuery } from './connection.js';

/**
 * 1) List all tables (already implemented)
 */
export async function listAllTables() {
  const query = `
    SELECT tablename
    FROM pg_catalog.pg_tables
    WHERE schemaname NOT IN ('pg_catalog', 'information_schema');
  `;
  const result = await executeQuery(query);
  return result.rows; 
}

/**
 * List attributes (column names) and data types for each table in the public schema.
 */
export async function listAllTableColumns() {
  const query = `
    SELECT 
      table_name,
      column_name,
      data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position;
  `;
  const result = await executeQuery(query);
  return result.rows;
}

/**
 * 2) Get columns of a table (if you need to dynamically fetch columns)
 */
export async function listTableColumns(tableName: string) {
  const query = `
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = $1
    ORDER BY ordinal_position;
  `;
  const result = await executeQuery(query, [tableName]);
  return result.rows;
}

/**
 * 3) Fetch all customers (chats) from "customerlist",
 *    including the last message from "daily_message" if you wish.
 */
export async function getAllChats() {
  const query = `
    SELECT
      c.id,
      c.wa_id,
      c.name,
      c.language,
      c.importance,
      c.labelname, 
      c.usage,
      c.createdon,
      (
        SELECT dm.input_content
        FROM daily_message dm
        WHERE dm.wa_id = c.wa_id
        ORDER BY dm.input_time DESC
        LIMIT 1
      ) AS last_message
    FROM customerlist c
    ORDER BY c.name;
  `;
  const result = await executeQuery(query);
  return result.rows;
}

/**
 * 4) Get a specific customer by wa_id (optional helper)
 */
export async function getCustomerByWaId(wa_id: string) {
  const query = `
    SELECT *
    FROM customerlist
    WHERE wa_id = $1
    LIMIT 1;
  `;
  const result = await executeQuery(query, [wa_id]);
  return result.rows[0];
}

/**
 * 5) Fetch all messages for a given customer (by wa_id) from "daily_message"
 */
export async function getMessagesByWaId(wa_id: string) {
  const query = `
    SELECT *
    FROM daily_message
    WHERE wa_id = $1
    ORDER BY input_time ASC;
  `;
  const result = await executeQuery(query, [wa_id]);
  return result.rows;
}

/**
 * 6) Fetch all labels from "customer_label"
 */
export async function getAllLabels() {
  const query = `
    SELECT 
      id,
      labelname,
      color,
      count,
      customer_id
    FROM customer_label
    ORDER BY id;
  `;
  const result = await executeQuery(query);
  return result.rows;
}

/**
 * 7) (Optional) Fetch a single label by ID
 */
export async function getLabelById(labelId: number) {
  const query = `
    SELECT *
    FROM customer_label
    WHERE id = $1
    LIMIT 1;
  `;
  const result = await executeQuery(query, [labelId]);
  return result.rows[0];
}

/**
 * 8) Fetch google meets (optionally filter by wa_id)
 */
export async function getGoogleMeets(wa_id?: string) {
  let query = `SELECT * FROM google_meets`;
  const params: any[] = [];

  if (wa_id) {
    query += ` WHERE wa_id = $1`;
    params.push(wa_id);
  }
  query += ` ORDER BY starttime DESC;`;

  const result = await executeQuery(query, params);
  return result.rows;
}
