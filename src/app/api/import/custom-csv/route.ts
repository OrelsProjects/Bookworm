import Logger from "@/src/utils/loggerServer";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import { NextRequest, NextResponse } from "next/server";

type PresignedURLResponse = {
  fileName: string;
  signedUrl: string;
};

const importCSV = async (req: NextRequest, file: File): Promise<void> => {
  const axios = GetAxiosInstance(req);
  try {
    const fileContent: string = await file.text();
    await axios.post("/import-list", {
      fileContent,
    });
  } catch (error: any) {
    Logger.error("Error getting presigned url", getUserIdFromRequest(req), {
      error,
      headers: axios.defaults.headers,
    });
    throw error;
  }
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  const axios = GetAxiosInstance(req);
  let formData: FormData = await req.formData();
  let file: File = formData.values().next().value as File;
  let presignedUrl: PresignedURLResponse | undefined = undefined;

  try {
    await importCSV(req, file);
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    Logger.error("Error uploading file", getUserIdFromRequest(req), {
      error: error ?? "Unknown error",
      presignedUrl,
      headers: axios.defaults.headers,
    });

    return NextResponse.json({}, { status: 500 });
  }
}
