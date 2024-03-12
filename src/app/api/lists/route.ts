import { NextRequest, NextResponse } from "next/server";
import { BooksListData } from "../../../models/booksList";
import { IResponse } from "../../../models/dto/response";
import {
  GetAxiosInstance,
  getUserIdFromRequest,
} from "../../../utils/apiUtils";
import { setThumbnailColorsToBooksListData } from "../list/_utils/thumbnailUtils";
import Logger from "../../../utils/loggerServer";

export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<BooksListData[]>>> {
  try {
    const axios = GetAxiosInstance(req);
    const response = await axios.get<BooksListData[]>("/lists");
    let bookListData = response.data;
    bookListData = await setThumbnailColorsToBooksListData(bookListData);
    const result = {
      result: bookListData,
    };
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    Logger.error(
      "Error getting user book lists",
      getUserIdFromRequest(req),
      {
        error,
      }
    );
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: NextRequest) {}
