import { Pool } from "pg";
import fs from "fs";
import path from "path";

// If using TypeScript, define a type for the query parameters
type QueryParams = Array<string | number>;

let pool: Pool;

const initializePool = () => {
  console.log("Database URL:", process.env.DATABASE_URL);
  const pemPath = path.join(process.cwd(), "src/secrets/global-bundle.pem");

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
      ca: fs.readFileSync(pemPath),
    },
  });
};

// Function to get the pool instance
export const getPool = () => {
  if (!pool) {
    initializePool();
  }
  return pool;
};

export const query = async (text: string, params?: QueryParams) => {
  await console.log(`Starting db query ${text} with params ${params}`);
  const start = Date.now();
  const res = await getPool().query(text, params);
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: res.rowCount });
  return res.rows;
};
