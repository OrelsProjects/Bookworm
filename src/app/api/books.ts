import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../db/db"; // Adjust the path based on your project structure

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await query("SELECT * FROM reading_status LIMIT 3", []);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
