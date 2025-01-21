// store2DB.ts
import { executeQuery } from './connection.js';

/**
 * 1) Store a new message into "daily_message"
 */
export async function storeDailyMessage(params: {
  wa_id: string;
  name: string;
  language?: string;
  input_time?: string;   // e.g. "2023-10-10 12:00:00"
  weekday?: string;      // e.g. "Monday"
  input_type?: string;   // e.g. "text"
  agent?: string;        // e.g. "cs" or "bot"
  conv_mode?: string;    // e.g. "human" or "ai"
  input_imgid?: string;
  input_content?: string; 
  response?: string;
}) {
  const query = `
    INSERT INTO daily_message (
      wa_id,
      name,
      language,
      input_time,
      weekday,
      input_type,
      agent,
      conv_mode,
      input_imgid,
      input_content,
      response
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11
    )
    RETURNING *;
  `;

  const values = [
    params.wa_id,
    params.name,
    params.language || null,
    params.input_time || new Date().toISOString(), // default to "now" if needed
    params.weekday || null,
    params.input_type || 'text',
    params.agent || null,
    params.conv_mode || null,
    params.input_imgid || null,
    params.input_content || null,
    params.response || null,
  ];

  const result = await executeQuery(query, values);
  return result.rows[0];
}

/**
 * 2) Toggle importance in "customerlist"
 *    e.g. store 'important' or 'normal' in the "importance" column
 */
export async function toggleImportance(wa_id: string, isImportant: boolean) {
  // If isImportant = true, store 'important'; otherwise 'normal'
  const importanceValue = isImportant ? 'important' : 'normal';
  const query = `
    UPDATE customerlist
    SET importance = $2
    WHERE wa_id = $1
    RETURNING *;
  `;
  const result = await executeQuery(query, [wa_id, importanceValue]);
  return result.rows[0];
}

/**
 * 3) (Optional) If you want to toggle a "conv_mode" across the entire customer:
 *    - Currently, there's no column like "is_ai" or "conv_mode" in `customerlist`.
 *    - You'd need to ADD a column, e.g. ALTER TABLE customerlist ADD COLUMN conv_mode text;
 *    - Then do:
 */
export async function toggleConvMode(wa_id: string, newMode: string) {
  // e.g. newMode could be 'human' or 'ai'
  const query = `
    UPDATE customerlist
    SET conv_mode = $2
    WHERE wa_id = $1
    RETURNING *;
  `;
  const result = await executeQuery(query, [wa_id, newMode]);
  return result.rows[0];
}

/**
 * 4) Create a new label in "customer_label".
 *    You can default "count" to 0 and "customer_id" to an empty array if needed.
 */
export async function createLabel(labelname: string, color: string) {
  const query = `
    INSERT INTO customer_label (labelname, color, count, customer_id)
    VALUES ($1, $2, 0, '{}')
    RETURNING *;
  `;
  const result = await executeQuery(query, [labelname, color]);
  return result.rows[0];
}

/**
 * 5) Delete a label
 */
export async function deleteLabel(labelId: number) {
  const query = `
    DELETE FROM customer_label
    WHERE id = $1
    RETURNING *;
  `;
  const result = await executeQuery(query, [labelId]);
  return result.rows[0];
}

/**
 * 6) Assign a label to a customer by updating "customer_id" array in customer_label.
 *    (Assuming "customer_id" is an int[] referencing customerlist.id).
 */
export async function assignLabel(labelId: number, customerId: number) {
  // array_append: add 'customerId' to the existing customer_id array
  const query = `
    UPDATE customer_label
    SET customer_id = array_append(customer_id, $2),
        count = count + 1
    WHERE id = $1
    RETURNING *;
  `;
  const result = await executeQuery(query, [labelId, customerId]);
  return result.rows[0];
}

/**
 * 7) Remove a label from a customer by removing that ID from "customer_id" array.
 */
export async function removeLabel(labelId: number, customerId: number) {
  const query = `
    UPDATE customer_label
    SET customer_id = array_remove(customer_id, $2),
        count = GREATEST(count - 1, 0)
    WHERE id = $1
    RETURNING *;
  `;
  const result = await executeQuery(query, [labelId, customerId]);
  return result.rows[0];
}

/**
 * 8) Store a new Google Meet event in "google_meets"
 */
export async function storeGoogleMeet(params: {
  wa_id: string;
  name: string;
  meetingtype: string;
  topic: string;
  starttime: string;
  endtime: string;
  timezone: string;
  event_id: string;
  status: string;
  creator: string;
  organizer: string;
  attendee: string;
  meeting_link: string;
}) {
  const query = `
    INSERT INTO google_meets (
      wa_id, name, meetingtype, topic, starttime,
      endtime, timezone, event_id, status, creator,
      organizer, attendee, meeting_link
    )
    VALUES ($1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11, $12, $13)
    RETURNING *;
  `;
  const values = [
    params.wa_id,
    params.name,
    params.meetingtype,
    params.topic,
    params.starttime,
    params.endtime,
    params.timezone,
    params.event_id,
    params.status,
    params.creator,
    params.organizer,
    params.attendee,
    params.meeting_link,
  ];
  const result = await executeQuery(query, values);
  return result.rows[0];
}
