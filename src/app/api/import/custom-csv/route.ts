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
  const axios = GetAxiosInstance(req);
  let file: File | undefined = undefined;
  let formData: FormData | undefined = undefined;
  let presignedUrl: PresignedURLResponse | undefined = undefined;
  try {
    formData = await req.formData();
    file = formData.values().next().value as File;
    Logger.info("Getting presigned url", getUserIdFromRequest(req));
    const response = await axios.get<PresignedURLResponse>(
      "/import-list/signed-url"
    );
    Logger.info("Got presigned url", getUserIdFromRequest(req), {
      data: response.data,
    });
    presignedUrl = response.data;
    if (!presignedUrl || !presignedUrl.file_name || !presignedUrl.signed_url) {
      throw new Error("Failed to get presigned url, it was null");
    }
  } catch (error: any) {
    Logger.error("Error getting presigned url", getUserIdFromRequest(req), {
      error,
      headers: axios.defaults.headers,
    });
    return NextResponse.json({}, { status: 500 });
  }

  try {
    const uploadFileResponse = await fetch(presignedUrl?.signed_url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (uploadFileResponse.status !== 200) {
      throw new Error("Failed to upload file", {
        cause: {
          status: uploadFileResponse.status,
          statusText: uploadFileResponse.statusText,
        },
      });
    }
    try {
      await axios.post("/import-list/trigger-custom", {
        file_name: presignedUrl.file_name,
      });
    } catch (error: any) {
      Logger.error(
        "Error triggering custom import",
        getUserIdFromRequest(req),
        {
          error,
          headers: axios.defaults.headers,
        }
      );
      return NextResponse.json({}, { status: 500 });
    }

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
    Logger.error("Error uploading file", getUserIdFromRequest(req), {
      error: error ?? "Unknown error",
      presignedUrl,
      headers: axios.defaults.headers,
    });

    return NextResponse.json({
      error: error ?? "Unknown error",
    }, { status: 500 });
  }
}
