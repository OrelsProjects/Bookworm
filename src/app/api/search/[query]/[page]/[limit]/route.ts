import Logger from "@/src/utils/loggerServer";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import { Book } from "../../../../../../models";
import { NextRequest, NextResponse } from "next/server";
import { setThumbnailColorsToBooks } from "../../../../list/_utils/thumbnailUtils";
import { SearchResults } from "../../../../../../models/search";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      query: string;
      page: string;
      limit: string;
    };
  }
): Promise<NextResponse> {
  let query: string | null = "";
  try {
    query = params.query;
    const page = params.page || "1";
    const limit = params.limit || "10";
    if (!query) {
      return NextResponse.json(
        { error: "Missing query parameter" },
        { status: 400 }
      );
    }
    const axios = GetAxiosInstance(req);
    const response = await axios.get<SearchResults>(
      `/search?query=${query}&page=${page}&limit=${limit}`
    );
    const SearchResults = response.data ?? [];
    // let top3BooksWithColors = books.slice(0, 3);
    // const restOfBooks = books.slice(3);
    // top3BooksWithColors = await setThumbnailColorsToBooks(top3BooksWithColors);
    // const booksWithColors = top3BooksWithColors.concat(restOfBooks);

    return NextResponse.json({ result: SearchResults }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error getting google books", getUserIdFromRequest(req), {
      data: {
        query,
      },
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}
