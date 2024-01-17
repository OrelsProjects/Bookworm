import Logger from "@/src/utils/loggerServer";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import { IResponse } from "@/src/models/dto/response";
import { NextRequest, NextResponse } from "next/server";

type PresignedURLResponse = {
  file_name: string;
  signed_url: string;
};

export async function GET(req: NextRequest): Promise<
  NextResponse<
    IResponse<{
      fileName: string;
      signedUrl: string;
    }>
  >
> {
  try {
    const axios = GetAxiosInstance(req);
    const response = await axios.get<PresignedURLResponse>(
      "/import-list/signed-url"
    );
    const result = response.data;
    return NextResponse.json(
      {
        result: {
          fileName: result.file_name,
          signedUrl: result.signed_url,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    Logger.error("Error getting presigned url", 
    getUserIdFromRequest(req),
    {
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}
