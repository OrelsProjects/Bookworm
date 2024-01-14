import { Logger } from "@/src/logger";
import { GoodreadsData } from "@/src/models";
import { GoodreadsDataDTO } from "@/src/models/dto";
import { IResponse } from "@/src/models/dto/response";
import { GetAxiosInstance } from "@/src/utils/axiosInstance";
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

    const response = await axios.get<GoodreadsDataDTO>(`goodreads-book`, {
      params: {
        bookISBN: isbn,
      },
    });
    const { data } = response;
    const goodreadsData = GoodreadsDataDTO.FromResponse(data);
    return NextResponse.json(
      {
        result: goodreadsData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    Logger.error("Error getting goodreads data", {
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
