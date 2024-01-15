import { Logger } from "@/src/logger";
import { ImportStatus } from "@/src/models";
import { ImportStatusDTO } from "@/src/models/dto/importStatusDTO";
import { IResponse } from "@/src/models/dto/response";
import { FromResponseImportStatus } from "@/src/models/importStatus";
import { GetAxiosInstance } from "@/src/utils/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<ImportStatus>>> {
  try {
    const axios = GetAxiosInstance(req);
    const response = await axios.get<ImportStatusDTO>("/import-list/result");
    const importStatus = FromResponseImportStatus(response.data);
    return NextResponse.json({ result: importStatus }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error getting import status", {
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST() {}
