import { executeQuery } from './connection.js';
/**
 * 1) List all tables (already done)
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
 * 2) Fetch all chats from "customerlist".
 *    Possibly also join "daily_message" if you need the last message.
 */
export async function getAllChats() {
    const query = `
    SELECT c.wa_id,
           c.name,
           c.is_ai,
           c.is_important,
           (
             SELECT dm.message_content
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
 * 3) Fetch messages from "daily_message"
 *    (For example, if you want to get all messages for a given wa_id)
 */
export async function getMessagesByWaId(wa_id) {
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
 * 4) Fetch analytics (active users, AI-handled, etc.)
 *    This is an example placeholder; you'll need to adapt your real queries.
 */
export async function getActiveUsersLast24H() {
    // Example: Count distinct wa_id from daily_message in the last 24 hours
    const query = `
    SELECT COUNT(DISTINCT wa_id) AS active_users
    FROM daily_message
    WHERE input_time >= NOW() - INTERVAL '24 HOURS';
  `;
    const result = await executeQuery(query);
    return result.rows[0]?.active_users || 0;
}
export async function getBookedMeetingsLastMonth() {
    // Example: from google_meets or a similar table
    const query = `
    SELECT COUNT(*) AS booked_count
    FROM google_meets
    WHERE scheduled_time >= NOW() - INTERVAL '1 MONTH';
  `;
    const result = await executeQuery(query);
    return result.rows[0]?.booked_count || 0;
}
/**
 * 5) Fetch all labels from "customer_label".
 *    If your table structure is more complex (e.g. a separate 'label' table vs. a pivot),
 *    adapt as needed.
 */
export async function getAllLabels() {
    const query = `
    SELECT id, name, color
    FROM customer_label
    ORDER BY id;
  `;
    const result = await executeQuery(query);
    return result.rows;
}
/**
 * 6) Possibly get all WAIDs by region from "customerlist"
 */
export async function getWaIdsByRegion() {
    const query = `
    SELECT region, COUNT(*) as amount
    FROM customerlist
    GROUP BY region;
  `;
    const result = await executeQuery(query);
    return result.rows;
}
//# sourceMappingURL=getFromDB.js.map