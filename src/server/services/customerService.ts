import { db } from "../config/database";
import { CustomerStats } from "../types";

export class CustomerService {
  static async getStats(): Promise<CustomerStats> {
    try {
      const result = await db.query(`
       SELECT COUNT(*) as count
       FROM customerlist
       WHERE name IS NOT NULL
     `);

      const monthlyResult = await db.query(`
       SELECT COUNT(*) as new_count
       FROM customerlist
       WHERE createdon >= date_trunc('month', CURRENT_DATE)
     `);

      const totalCustomers = parseInt(result.rows[0].count);
      const newCustomers = parseInt(monthlyResult.rows[0].new_count || "0");

      const monthlyGrowth =
        newCustomers > 0 ? ((newCustomers / totalCustomers) * 100).toFixed(1) : "0.0";

      return {
        totalCustomers,
        monthlyGrowth,
      };
    } catch (error) {
      console.error("Error getting customer stats:", error);
      throw error;
    }
  }

  static async getCustomers() {
    try {
      const result = await db.query(`
       SELECT name
       FROM customerlist
       WHERE name IS NOT NULL
       ORDER BY name
     `);
      return result.rows;
    } catch (error) {
      console.error("Error getting customers:", error);
      throw error;
    }
  }
  static async getMessages() {
    try {
      const messages = await db.query(`
       SELECT regexp_matches(input_content, '[a-zA-Z0-9_]+', 'g') AS keywords
       FROM daily_message
       WHERE input_content ~ '[a-zA-Z0-9_]+[[:space:]][a-zA-Z0-9_]+'
     `);

      const words = messages.rows.map((row: { keywords: any }) => row.keywords).flat();

      const hotWords = getHotWords(words);
      return hotWords;
    } catch (error) {
      console.error("Error getting hotWords:", error);
      throw error;
    }
  }

  static async getActiveUsers(): Promise<any> {
    try {
      const queries = {
        "Last 24 Hours": `
          SELECT
            CASE
              WHEN EXTRACT(HOUR FROM input_time) >= 0 AND EXTRACT(HOUR FROM input_time) < 3 THEN '12 AM'
              WHEN EXTRACT(HOUR FROM input_time) >= 3 AND EXTRACT(HOUR FROM input_time) < 6 THEN '3 AM'
              WHEN EXTRACT(HOUR FROM input_time) >= 6 AND EXTRACT(HOUR FROM input_time) < 9 THEN '6 AM'
              WHEN EXTRACT(HOUR FROM input_time) >= 9 AND EXTRACT(HOUR FROM input_time) < 12 THEN '9 AM'
              WHEN EXTRACT(HOUR FROM input_time) >= 12 AND EXTRACT(HOUR FROM input_time) < 15 THEN '12 PM'
              WHEN EXTRACT(HOUR FROM input_time) >= 15 AND EXTRACT(HOUR FROM input_time) < 18 THEN '3 PM'
              WHEN EXTRACT(HOUR FROM input_time) >= 18 AND EXTRACT(HOUR FROM input_time) < 21 THEN '6 PM'
              ELSE '9 PM'
            END AS time_interval,
            COUNT(DISTINCT name) AS info
          FROM daily_message
          WHERE input_time >= CURRENT_DATE AND input_time < CURRENT_DATE + INTERVAL '1 day'
          GROUP BY time_interval
          ORDER BY MIN(input_time); -- Order by the earliest time in each interval
        `,
        "Last Week": `
          SELECT
            TO_CHAR(input_time, 'Day') AS day_of_week,
            COUNT(DISTINCT name) AS info
          FROM daily_message
          WHERE input_time >= CURRENT_DATE - INTERVAL '6 days'
            AND input_time < CURRENT_DATE + INTERVAL '1 day'
          GROUP BY day_of_week
          ORDER BY MIN(input_time); -- Order by the earliest time in each interval
        `,
        "Last Month": `
          SELECT
            TO_CHAR(input_time, 'YYYY-MM-DD') AS day,
            COUNT(DISTINCT name) AS info
          FROM daily_message
          WHERE input_time >= CURRENT_DATE - INTERVAL '29 days'
            AND input_time < CURRENT_DATE + INTERVAL '1 day'
          GROUP BY day
          ORDER BY MIN(input_time); -- Order by the earliest time in each day
        `,
        "Last 2 Months": `
          SELECT
            TO_CHAR(DATE_TRUNC('week', input_time), 'YYYY-MM-DD') AS week,
            COUNT(DISTINCT name) AS info
          FROM daily_message
          WHERE input_time >= CURRENT_DATE - INTERVAL '8 weeks'
            AND input_time < CURRENT_DATE + INTERVAL '1 day'
          GROUP BY week
          ORDER BY MIN(input_time); -- Order by the earliest time in each week
        `,
        "Last Quarter": `
          SELECT
            TO_CHAR(DATE_TRUNC('week', input_time), 'YYYY-MM-DD') AS week,
            COUNT(DISTINCT name) AS info
          FROM daily_message
          WHERE input_time >= CURRENT_DATE - INTERVAL '12 weeks'
            AND input_time < CURRENT_DATE + INTERVAL '1 day'
          GROUP BY week
          ORDER BY MIN(input_time); -- Order by the earliest time in each week
        `,
      };

      const result = await db.query(queries["Last 24 Hours"]);
      const result1 = await db.query(queries["Last Week"]);
      const result2 = await db.query(queries["Last Month"]);
      const result3 = await db.query(queries["Last 2 Months"]);
      const result4 = await db.query(queries["Last Quarter"]);

      return [result.rows, result1.rows, result2.rows, result3.rows, result4.rows];
    } catch (error) {
      console.error("Error fetching active users for all timelines:", error);
      throw error;
    }
  }
  static async getBookedMeetings(): Promise<any> {
    try {
      const queries = {
        "Last 24 Hours": `
          SELECT
            CASE
              WHEN EXTRACT(HOUR FROM starttime) >= 0 AND EXTRACT(HOUR FROM starttime) < 3 THEN '12 AM'
              WHEN EXTRACT(HOUR FROM starttime) >= 3 AND EXTRACT(HOUR FROM starttime) < 6 THEN '3 AM'
              WHEN EXTRACT(HOUR FROM starttime) >= 6 AND EXTRACT(HOUR FROM starttime) < 9 THEN '6 AM'
              WHEN EXTRACT(HOUR FROM starttime) >= 9 AND EXTRACT(HOUR FROM starttime) < 12 THEN '9 AM'
              WHEN EXTRACT(HOUR FROM starttime) >= 12 AND EXTRACT(HOUR FROM starttime) < 15 THEN '12 PM'
              WHEN EXTRACT(HOUR FROM starttime) >= 15 AND EXTRACT(HOUR FROM starttime) < 18 THEN '3 PM'
              WHEN EXTRACT(HOUR FROM starttime) >= 18 AND EXTRACT(HOUR FROM starttime) < 21 THEN '6 PM'
              ELSE '9 PM'
            END AS time_interval,
            COUNT(*) AS info
          FROM google_meets
          WHERE status = 'confirmed'
            AND starttime >= CURRENT_DATE AND starttime < CURRENT_DATE + INTERVAL '1 day'
          GROUP BY time_interval
          ORDER BY time_interval;         
        `,
        "Last Week": `
          SELECT
            TO_CHAR(starttime, 'Day') AS day_of_week,
            COUNT(*) AS info
          FROM google_meets
          WHERE status = 'confirmed'
            AND starttime >= NOW() - INTERVAL '6 days'
          GROUP BY day_of_week
          ORDER BY MIN(starttime);      
        `,
        "Last Month": `
          SELECT
            TO_CHAR(starttime, 'YYYY-MM-DD') AS day,
            COUNT(*) AS info
          FROM google_meets
          WHERE status = 'confirmed'
            AND starttime >= CURRENT_DATE - INTERVAL '29 days'
            AND starttime < CURRENT_DATE + INTERVAL '1 day'
          GROUP BY day
          ORDER BY day;      
        `,
        "Last 2 Months": `
          SELECT
            TO_CHAR(DATE_TRUNC('week', starttime), 'YYYY-MM-DD') AS week,
            COUNT(*) AS info
          FROM google_meets
          WHERE status = 'confirmed'
            AND starttime >= NOW() - INTERVAL '2 months'
          GROUP BY week
          ORDER BY week;      
        `,
        "Last Quarter": `
          SELECT
            TO_CHAR(DATE_TRUNC('week', starttime), 'YYYY-MM-DD') AS week,
            COUNT(*) AS info
          FROM google_meets
          WHERE status = 'confirmed'
            AND starttime >= NOW() - INTERVAL '3 months'
          GROUP BY week
          ORDER BY week;
        `,
      };

      const result = await db.query(queries["Last 24 Hours"]);
      const result1 = await db.query(queries["Last Week"]);
      const result2 = await db.query(queries["Last Month"]);
      const result3 = await db.query(queries["Last 2 Months"]);
      const result4 = await db.query(queries["Last Quarter"]);

      return [result.rows, result1.rows, result2.rows, result3.rows, result4.rows];
    } catch (error) {
      console.error("Error fetching booked meetings:", error);
      throw error;
    }
  }
  static async getAIhandled(): Promise<any> {
    try {
      const queries = {
        "Last 24 Hours": `
          SELECT
            CASE
              WHEN EXTRACT(HOUR FROM input_time) >= 0 AND EXTRACT(HOUR FROM input_time) < 3 THEN '12 AM'
              WHEN EXTRACT(HOUR FROM input_time) >= 3 AND EXTRACT(HOUR FROM input_time) < 6 THEN '3 AM'
              WHEN EXTRACT(HOUR FROM input_time) >= 6 AND EXTRACT(HOUR FROM input_time) < 9 THEN '6 AM'
              WHEN EXTRACT(HOUR FROM input_time) >= 9 AND EXTRACT(HOUR FROM input_time) < 12 THEN '9 AM'
              WHEN EXTRACT(HOUR FROM input_time) >= 12 AND EXTRACT(HOUR FROM input_time) < 15 THEN '12 PM'
              WHEN EXTRACT(HOUR FROM input_time) >= 15 AND EXTRACT(HOUR FROM input_time) < 18 THEN '3 PM'
              WHEN EXTRACT(HOUR FROM input_time) >= 18 AND EXTRACT(HOUR FROM input_time) < 21 THEN '6 PM'
              ELSE '9 PM'
            END AS time_interval,
            COUNT(DISTINCT name) AS info
          FROM daily_message dm
          WHERE input_time >= (CURRENT_DATE - INTERVAL '1 day') AND input_time < CURRENT_DATE
            AND name NOT IN (
              SELECT name
              FROM daily_message
              WHERE conv_mode != 'AI'
            )
          GROUP BY time_interval
          ORDER BY time_interval;         
        `,
        "Last Week": `
          SELECT
            TO_CHAR(input_time, 'Day') AS day_of_week,
            COUNT(DISTINCT name) AS info
          FROM daily_message dm
          WHERE input_time >= (CURRENT_DATE - INTERVAL '6 days') AND input_time < CURRENT_DATE
            AND name NOT IN (
              SELECT name
              FROM daily_message
              WHERE conv_mode != 'AI'
            )
          GROUP BY day_of_week
          ORDER BY MIN(input_time);     
        `,
        "Last Month": `
          SELECT
            TO_CHAR(input_time, 'YYYY-MM-DD') AS day,
            COUNT(DISTINCT name) AS info
          FROM daily_message dm
          WHERE input_time >= (CURRENT_DATE - INTERVAL '1 month') AND input_time < CURRENT_DATE
            AND name NOT IN (
              SELECT name
              FROM daily_message
              WHERE conv_mode != 'AI'
            )
          GROUP BY day
          ORDER BY day;
        `,
        "Last 2 Months": `
          SELECT
            TO_CHAR(DATE_TRUNC('week', input_time), 'YYYY-MM-DD') AS week,
            COUNT(DISTINCT name) AS info
          FROM daily_message dm
          WHERE input_time >= (CURRENT_DATE - INTERVAL '2 months') AND input_time < CURRENT_DATE
            AND name NOT IN (
              SELECT name
              FROM daily_message
              WHERE conv_mode != 'AI'
            )
          GROUP BY week
          ORDER BY week;
        `,
        "Last Quarter": `
          SELECT
            TO_CHAR(DATE_TRUNC('week', input_time), 'YYYY-MM-DD') AS week,
            COUNT(DISTINCT name) AS info
          FROM daily_message dm
          WHERE input_time >= (CURRENT_DATE - INTERVAL '3 months') AND input_time < CURRENT_DATE
            AND name NOT IN (
              SELECT name
              FROM daily_message
              WHERE conv_mode != 'AI'
            )
          GROUP BY week
          ORDER BY week;
        `,
      };

      const result = await db.query(queries["Last 24 Hours"]);
      const result1 = await db.query(queries["Last Week"]);
      const result2 = await db.query(queries["Last Month"]);
      const result3 = await db.query(queries["Last 2 Months"]);
      const result4 = await db.query(queries["Last Quarter"]);

      return [result.rows, result1.rows, result2.rows, result3.rows, result4.rows];
    } catch (error) {
      console.error("Error fetching AI handled:", error);
      throw error;
    }
  }
}

interface WordFrequency {
  word: string;
  count: number;
}

const stopWords = new Set([
  "i",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "ourselves",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "her",
  "hers",
  "herself",
  "it",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "these",
  "those",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "a",
  "an",
  "the",
  "and",
  "but",
  "if",
  "or",
  "because",
  "as",
  "until",
  "while",
  "of",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "s",
  "t",
  "can",
  "will",
  "just",
  "don",
  "should",
  "now",
]);

function getHotWords(words: string[]): WordFrequency[] {
  // Count frequencies using a Map
  const frequencies = new Map<string, number>();

  for (const word of words) {
    if (!stopWords.has(word.toLowerCase())) {
      frequencies.set(word, (frequencies.get(word) || 0) + 1);
    }
  }

  // Convert to array and sort by frequency
  return Array.from(frequencies.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
