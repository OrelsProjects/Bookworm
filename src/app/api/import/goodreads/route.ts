import { IResponse } from "@/src/models/dto/response";
import { GetAxiosInstance } from "@/src/utils/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<IResponse<void>>> {
  try {
    const url = req.nextUrl;
    const goodreadsUserId = url.searchParams.get("goodreadsUserId") ?? "";
    const shelfName = url.searchParams.get("shelfName") ?? "";

    const axios = GetAxiosInstance(req);
    const response = await axios.post("/import-list/trigger-goodreads", null, {
      params: {
        goodreads_user_id: goodreadsUserId,
        shelf_name: shelfName,
      },
    });

    const result = response.data;
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error("Error: ", error?.response?.data?.message ?? error);
    return NextResponse.json({}, { status: 500 });
  }
}
