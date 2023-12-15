import { NextResponse } from "next/server";

export async function GET() {

  try {
    
    return NextResponse.json({ a: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ a: 17 });
  }
}
