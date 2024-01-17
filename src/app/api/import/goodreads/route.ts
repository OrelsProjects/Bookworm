import Logger from "@/src/utils/loggerServer";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import { IResponse } from "@/src/models/dto/response";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<IResponse<void>>> {
  let goodreadsUserId: string | null = "";
  let shelfName: string | null = "";
  try {
    const url = req.nextUrl;
    goodreadsUserId = url.searchParams.get("goodreadsUserId") ?? "";
    shelfName = url.searchParams.get("shelfName") ?? "";

    const axios = GetAxiosInstance(req);
    const response = await axios.post("/import-list/trigger-goodreads", null, {
      params: {
        goodreads_user_id: goodreadsUserId,
        shelf_name: shelfName,
      },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    Logger.error(
      "Error triggering goodreads import",
      getUserIdFromRequest(req),
      {
        data: {
          goodreadsUserId,
          shelfName,
          headers: req.headers,
        },
        error,
      }
    );
    return NextResponse.json({}, { status: 500 });
  }
}
