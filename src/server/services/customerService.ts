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

      const monthlyGrowth = newCustomers > 0 ? ((newCustomers / totalCustomers) * 100).toFixed(1) : "0.0";

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
