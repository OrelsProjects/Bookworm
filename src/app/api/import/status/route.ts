import Logger from "@/utils/loggerServer";
import { GetAxiosInstance, getUserIdFromRequest } from "@/utils/apiUtils";
import { ImportStatus } from "@/models";
import { IResponse } from "@/models/dto/response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<ImportStatus>>> {
  try {
    const axios = GetAxiosInstance(req);
    const response = await axios.get<ImportStatus>(
      "/import-list/status-latest"
    );
    const importStatus = response.data;
    return NextResponse.json({ result: importStatus }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error getting import status", getUserIdFromRequest(req), {
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST() {}
