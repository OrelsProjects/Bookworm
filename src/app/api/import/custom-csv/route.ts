import Logger from "@/src/utils/loggerServer";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import { IResponse } from "@/src/models/dto/response";
import { NextRequest, NextResponse } from "next/server";

type PresignedURLResponse = {
  file_name: string;
  signed_url: string;
};

export async function PUT(req: NextRequest): Promise<
  NextResponse<
    IResponse<{
      fileName: string;
      signedUrl: string;
    }>
  >
> {
  try {
    const formData = await req.formData();
    const file = formData.values().next().value as File;
    const axios = GetAxiosInstance(req);
    const axiosPreviousBaseUrl = axios.defaults.baseURL; // Workaround until local presigned url fixed with autorized url
    axios.defaults.baseURL =
      "https://72kvc34caj.execute-api.us-east-1.amazonaws.com/dev/api";

    const response = await axios.get<PresignedURLResponse>(
      "/import-list/signed-url"
    );
    const presignedUrl = response.data;
    if (!presignedUrl || !presignedUrl.file_name || !presignedUrl.signed_url) {
      throw new Error("Failed to get presigned url");
    }

    axios.defaults.baseURL = axiosPreviousBaseUrl;

    const fileWithNewName = new FormData();
    fileWithNewName.append("file", file, presignedUrl.file_name);

    const uploadFileResponse = await fetch(presignedUrl.signed_url, {
      method: "PUT",
      body: fileWithNewName,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (uploadFileResponse.status !== 200) {
      throw new Error("Failed to upload file", {
        cause: uploadFileResponse.statusText,
      });
    }

    await axios.post("/import-list/trigger-custom", {
      file_name: presignedUrl.file_name,
    });

    return NextResponse.json(
      {
        result: {
          fileName: presignedUrl.file_name,
          signedUrl: presignedUrl.signed_url,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    Logger.error("Error getting presigned url", getUserIdFromRequest(req), {
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}
