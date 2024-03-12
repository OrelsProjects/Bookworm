import { Logger } from "@/src/logger";
import { IResponse } from "@/src/models/dto/response";
import { GetAxiosInstance } from "@/src/utils/apiUtils";
import { NextRequest, NextResponse } from "next/server";
import { SafeBooksListData } from "../../../../models/booksList";
// import { setThumbnailColorsToSafeBooksInList } from "../_utils/thumbnailUtils";

export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<SafeBooksListData[]>>> {
  try {
    const axios = GetAxiosInstance(req);
    const response = await axios.get<SafeBooksListData[]>(
      "/lists/recommendation"
    );
    let safeBooksListData = response.data;
    // safeBooksListData = await setThumbnailColorsToSafeBooksInList(
    //   safeBooksListData
    // );
    const result = {
      result: safeBooksListData,
    };
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    Logger.error("Error getting user book lists", {
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: NextRequest) {}
