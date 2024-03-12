import Logger from "@/src/utils/loggerServer";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import { NextRequest, NextResponse } from "next/server";

type PresignedURLResponse = {
  fileName: string;
  signedUrl: string;
};

const importCSV = async (
  req: NextRequest,
  formData: FormData
): Promise<void> => {
  const file: File = formData.values().next().value as File;
  const axios = GetAxiosInstance(req);
  try {
    const fileContent: string = await file.text();
    await axios.post("/import-list", {
      fileContent,
    });
  } catch (error: any) {
    Logger.error("Error getting presigned url", getUserIdFromRequest(req), {
      error,
      data: { headers: axios.defaults.headers },
    });
    throw error;
  }
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  const axios = GetAxiosInstance(req);
  try {
    let formData: FormData = await req.formData();
    await importCSV(req, formData);
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    Logger.error("Error uploading file", getUserIdFromRequest(req), {
      error: error ?? "Unknown error",
      data: { headers: axios.defaults.headers },
    });

    return NextResponse.json({}, { status: 500 });
  }
}
