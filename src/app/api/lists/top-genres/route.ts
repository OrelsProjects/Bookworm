import { NextRequest, NextResponse } from "next/server";
import { IResponse } from "@/src/models/dto/response";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import Logger from "@/src/utils/loggerServer";

type Genres = string[];

export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<Genres>>> {
  let statusCode = 200;
  let responseBody: Genres = [];
  try {
    const axios = GetAxiosInstance(req);
    const response = await axios.get<Genres>("/lists/top-genres");
    responseBody = response.data;
    return NextResponse.json({ result: responseBody }, { status: statusCode });
  } catch (error: any) {
    Logger.error("Error getting lists by genre", getUserIdFromRequest(req), {
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}
