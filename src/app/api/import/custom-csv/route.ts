import Logger from "@/src/utils/loggerServer";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import { IResponse } from "@/src/models/dto/response";
import { NextRequest, NextResponse } from "next/server";

type PresignedURLResponse = {
  fileName: string;
  signedUrl: string;
};

const getPresignedUrl = async (
  req: NextRequest
): Promise<PresignedURLResponse> => {
  const axios = GetAxiosInstance(req);
  try {
    Logger.info("Getting presigned url", getUserIdFromRequest(req));
    const response = await axios.get<PresignedURLResponse>(
      "/import-list/signed-url"
    );
    Logger.info("Got presigned url", getUserIdFromRequest(req), {
      data: response.data,
    });
    const presignedUrl = response.data;
    if (!presignedUrl || !presignedUrl.fileName || !presignedUrl.signedUrl) {
      throw new Error("Failed to get presigned url, it was null");
    }
    return presignedUrl;
  } catch (error: any) {
    Logger.error("Error getting presigned url", getUserIdFromRequest(req), {
      error,
      headers: axios.defaults.headers,
    });
    throw error;
  }
};

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const axios = GetAxiosInstance(req);
  let formData: FormData = await req.formData();
  let file: File = formData.values().next().value as File;
  let presignedUrl: PresignedURLResponse | undefined = undefined;

  try {
    const presignedUrl = await getPresignedUrl(req);
    const uploadFileResponse = await fetch(presignedUrl.signedUrl, {
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
        fileName: presignedUrl.fileName,
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
          fileName: presignedUrl.fileName,
          signedUrl: presignedUrl.signedUrl,
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

    return NextResponse.json({}, { status: 500 });
  }
}
