import { GoodreadsData } from "@/src/models";
import { GoodreadsDataDTO } from "@/src/models/dto";
import { IResponse } from "@/src/models/dto/response";
import { GetAxiosInstance } from "@/src/utils/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<GoodreadsData | undefined>>> {
  try {
    const url = req.nextUrl;
    const isbn = url.searchParams.get("isbn");
    if (!isbn) {
      throw new Error("Missing isbn parameter");
    }
    const axios = GetAxiosInstance(req);

    const response = await axios.get<GoodreadsDataDTO>(`goodreads-book`, {
      params: {
        bookISBN: isbn,
      },
    });
    const { data } = response;
    const goodreadsData = GoodreadsDataDTO.FromResponse(data);
    return NextResponse.json(
      {
        result: goodreadsData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
