import { PresignedURL } from "@/src/hooks/useImport";
import { IResponse } from "@/src/models/dto/response";
import { GetAxiosInstance } from "@/src/utils/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

type PresignedURLResponse = {
  file_name: string;
  signed_url: string;
};

export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<PresignedURL>>> {
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
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
