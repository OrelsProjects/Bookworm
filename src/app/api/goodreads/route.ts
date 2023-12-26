import { GetAxiosInstance } from "@/src/utils/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const axios = GetAxiosInstance(req);
  
    // TODO: Return a report of lists of all success/duplicates/failures (Create a class for this)
    // const booksResult = bookDTOsWithIds.success.map((bookDTO) => bookDTOToBook(bookDTO));
    return NextResponse.json(
      {
        result: [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
