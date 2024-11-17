import Logger from "@/utils/loggerServer";
import { GetAxiosInstance, getUserIdFromRequest } from "@/utils/apiUtils";
import { GoodreadsData } from "@/models";
import { IResponse } from "@/models/dto/response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<GoodreadsData | undefined>>> {
  let isbn: string | null = "";
  try {
    const url = req.nextUrl;
    isbn = url.searchParams.get("isbn");
    if (!isbn) {
      return NextResponse.json(
        { error: "Missing isbn parameter" },
        { status: 400 }
      );
    }
    const axios = GetAxiosInstance(req);

    const response = await axios.get<GoodreadsData>(`goodreads-book`, {
      params: {
        bookISBN: isbn,
      },
    });
    const { data } = response;
    return NextResponse.json(
      {
        result: data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    Logger.error("Error getting goodreads data", getUserIdFromRequest(req), {
      data: {
        isbn,
      },
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}
