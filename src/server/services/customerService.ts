import { db } from "../config/database";
import { CustomerStats } from "../types";

import parsePhone from "../../../local_modules/phoneparser/index.js";

console.log(parsePhone("77718997711"));

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

  static async getData(
    tableName: string,
    column: string,
    additionalCondition: string = "",
    countDistinct: boolean = false
  ): Promise<any> {
    try {
      const countExpression = countDistinct ? `COUNT(DISTINCT name)` : `COUNT(*)`;
      const queries = {
        "Last 24 Hours": `
          SELECT
            CASE
              WHEN EXTRACT(HOUR FROM ${column}) >= 0 AND EXTRACT(HOUR FROM ${column}) < 3 THEN '12 AM'
              WHEN EXTRACT(HOUR FROM ${column}) >= 3 AND EXTRACT(HOUR FROM ${column}) < 6 THEN '3 AM'
              WHEN EXTRACT(HOUR FROM ${column}) >= 6 AND EXTRACT(HOUR FROM ${column}) < 9 THEN '6 AM'
              WHEN EXTRACT(HOUR FROM ${column}) >= 9 AND EXTRACT(HOUR FROM ${column}) < 12 THEN '9 AM'
              WHEN EXTRACT(HOUR FROM ${column}) >= 12 AND EXTRACT(HOUR FROM ${column}) < 15 THEN '12 PM'
              WHEN EXTRACT(HOUR FROM ${column}) >= 15 AND EXTRACT(HOUR FROM ${column}) < 18 THEN '3 PM'
              WHEN EXTRACT(HOUR FROM ${column}) >= 18 AND EXTRACT(HOUR FROM ${column}) < 21 THEN '6 PM'
              ELSE '9 PM'
            END AS time_interval,
            ${countExpression} AS info
          FROM ${tableName}
          WHERE ${column} >= CURRENT_DATE AND ${column} < CURRENT_DATE + INTERVAL '1 day'
          ${additionalCondition}
          GROUP BY time_interval
          ORDER BY MIN(${column});
        `,
        "Last Week": `
          SELECT
            TO_CHAR(${column}, 'Day') AS day_of_week,
            ${countExpression} AS info
          FROM ${tableName}
          WHERE ${column} >= CURRENT_DATE - INTERVAL '6 days'
            AND ${column} < CURRENT_DATE + INTERVAL '1 day'
            ${additionalCondition}
          GROUP BY day_of_week
          ORDER BY MIN(${column});
        `,
        "Last Month": `
          SELECT
            TO_CHAR(${column}, 'YYYY-MM-DD') AS day,
            ${countExpression} AS info
          FROM ${tableName}
          WHERE ${column} >= CURRENT_DATE - INTERVAL '29 days'
            AND ${column} < CURRENT_DATE + INTERVAL '1 day'
            ${additionalCondition}
          GROUP BY day
          ORDER BY day;
        `,
        "Last 2 Months": `
          SELECT
            TO_CHAR(DATE_TRUNC('week', ${column}), 'YYYY-MM-DD') AS week,
            ${countExpression} AS info
          FROM ${tableName}
          WHERE ${column} >= CURRENT_DATE - INTERVAL '8 weeks'
            AND ${column} < CURRENT_DATE + INTERVAL '1 day'
            ${additionalCondition}
          GROUP BY week
          ORDER BY week;
        `,
        "Last Quarter": `
          SELECT
            TO_CHAR(DATE_TRUNC('week', ${column}), 'YYYY-MM-DD') AS week,
            ${countExpression} AS info
          FROM ${tableName}
          WHERE ${column} >= CURRENT_DATE - INTERVAL '12 weeks'
            AND ${column} < CURRENT_DATE + INTERVAL '1 day'
            ${additionalCondition}
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
      console.error(`Error fetching data from ${tableName}:`, error);
      throw error;
    }
  }

  static async getWAIDS(): Promise<any> {
    try {
      const queries = {
        "Last 24 Hours": `
          SELECT
            ARRAY_AGG(DISTINCT wa_id) AS wa_ids
          FROM daily_message
          WHERE input_time >= CURRENT_DATE AND input_time < CURRENT_DATE + INTERVAL '1 day'            
        `,
        "Last Week": `
          SELECT
            ARRAY_AGG(DISTINCT wa_id) AS wa_ids
          FROM daily_message
          WHERE input_time >= CURRENT_DATE - INTERVAL '6 days' AND input_time < CURRENT_DATE + INTERVAL '1 day';
        `,
        "Last Month": `
          SELECT
            ARRAY_AGG(DISTINCT wa_id) AS wa_ids
          FROM daily_message
          WHERE input_time >= CURRENT_DATE - INTERVAL '29 days' AND input_time < CURRENT_DATE + INTERVAL '1 day';
        `,
        "Last 2 Months": `
          SELECT
            ARRAY_AGG(DISTINCT wa_id) AS wa_ids
          FROM daily_message
          WHERE input_time >= CURRENT_DATE - INTERVAL '8 weeks' AND input_time < CURRENT_DATE + INTERVAL '1 day';
        `,
        "Last Quarter": `
          SELECT
            ARRAY_AGG(DISTINCT wa_id) AS wa_ids
          FROM daily_message
          WHERE input_time >= CURRENT_DATE - INTERVAL '12 weeks' AND input_time < CURRENT_DATE + INTERVAL '1 day';
        `,
      };

      const result = await db.query(queries["Last 24 Hours"]);
      const result1 = await db.query(queries["Last Week"]);
      const result2 = await db.query(queries["Last Month"]);
      const result3 = await db.query(queries["Last 2 Months"]);
      const result4 = await db.query(queries["Last Quarter"]);

      const processWAIDs = (entries: { wa_ids: string[] }[], parsePhone: Function) => {
        if (!entries[0].wa_ids) {
          return [];
        }

        // Initialize a Map to group by region
        const regionMap = new Map<string, number>();

        // Traverse the entries and process each wa_id
        entries.forEach((entry) => {
          entry.wa_ids.forEach((wa_id) => {
            const parsed = parsePhone(wa_id); // Parse the phone number
            const region = `${parsed.countryISOCode} (+${parsed.countryCode})`; // Create region string

            // Update count in the map
            if (regionMap.has(region)) {
              regionMap.set(region, regionMap.get(region)! + 1);
            } else {
              regionMap.set(region, 1);
            }
          });
        });

        // Convert the Map into an array for the chart
        const regionData = Array.from(regionMap.entries()).map(([region, count]) => ({
          region,
          amount: count, // Use count for now; you can calculate percentages later
        }));

        return regionData;
      };

      const proccessedResult = processWAIDs(result.rows, parsePhone);
      const proccessedResult1 = processWAIDs(result1.rows, parsePhone);
      const proccessedResult2 = processWAIDs(result2.rows, parsePhone);
      const proccessedResult3 = processWAIDs(result3.rows, parsePhone);
      const proccessedResult4 = processWAIDs(result4.rows, parsePhone);

      return [
        proccessedResult,
        proccessedResult1,
        proccessedResult2,
        proccessedResult3,
        proccessedResult4,
      ];
    } catch (error) {
      console.error("Error fetching WAIDS:", error);
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
