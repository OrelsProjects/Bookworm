import { NextRequest, NextResponse } from "next/server";
import { GetAxiosInstance } from "../../../../utils/apiUtils";
import loggerServer from "../../../../loggerServer";
import { Book } from "../../../../models";
import { IResponse } from "../../../../models/dto/response";

export async function GET(
  req: NextRequest,
  { params }: { params: { isbn: number } }
): Promise<NextResponse<IResponse<Book>>> {
  try {
    const { isbn } = params;
    const axios = GetAxiosInstance(req);
    const urlParams = new URLSearchParams();
    urlParams.set("isbn", isbn.toString());
    // urlParams.set("by", "isbn");
    const response = await axios.get(`/book`, {
      params: urlParams,
    });
    const book = response.data;
    return NextResponse.json({ ...book }, { status: 200 });
  } catch (error: any) {
    loggerServer.error("Error getting book", "", {
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}
