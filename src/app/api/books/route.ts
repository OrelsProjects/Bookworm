import { query } from "@/src/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("starting get function    ");
  try {
    const result = await query("SELECT * FROM reading_status LIMIT 10", []);
    return NextResponse.json({ a: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ a: 17 });
  }
}
