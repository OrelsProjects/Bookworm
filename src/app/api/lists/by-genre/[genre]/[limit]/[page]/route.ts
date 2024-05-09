import { NextRequest, NextResponse } from "next/server";
import { BooksListData, SafeBooksListData } from "@/src/models/booksList";
import { IResponse } from "@/src/models/dto/response";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import Logger from "@/src/utils/loggerServer";

type GetListsByGenreParams = {
  page: number;
  limit: number;
  genre: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: GetListsByGenreParams }
): Promise<NextResponse<IResponse<SafeBooksListData[]>>> {
  let statusCode = 200;
  let responseBody: SafeBooksListData[] = [];
  try {
    const { page, limit, genre } = params;
    const axios = GetAxiosInstance(req);
    const queryParams = {
      page,
      limit,
      genre,
    };
    const response = await axios.get<SafeBooksListData[]>("/lists/by-genre", {
      params: queryParams,
    });
    responseBody = response.data;
    return NextResponse.json({ result: responseBody }, { status: statusCode });
  } catch (error: any) {
    Logger.error("Error getting lists by genre", getUserIdFromRequest(req), {
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}
