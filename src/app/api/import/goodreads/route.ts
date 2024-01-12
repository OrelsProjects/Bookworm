import { Logger } from "@/src/logger";
import { IResponse } from "@/src/models/dto/response";
import { GetAxiosInstance } from "@/src/utils/axiosInstance";
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
    Logger.error("Error triggering goodreads import", {
      data: {
        goodreadsUserId,
        shelfName,
      },
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}
