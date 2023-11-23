import { Pool } from "pg";
import fs from "fs";

// If using TypeScript, define a type for the query parameters
type QueryParams = Array<string | number>;

console.log("Database URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Configure SSL later before switching to production
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync(`${__dirname}/src/secrets/global-bundle.pem`),
  },
});

export const query = async (text: string, params?: QueryParams) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
};
