import Logger from "@/src/utils/loggerServer";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import { Book } from "../../../models";
import { NextRequest, NextResponse } from "next/server";
import { setThumbnailColorsToBooks } from "../list/_utils/thumbnailUtils";

export async function GET(req: NextRequest) {
  let query: string | null = "";
  try {
    const url = req.nextUrl;
    query = url.searchParams.get("query") ?? "";
    if (!query) {
      return NextResponse.json(
        { error: "Missing query parameter" },
        { status: 400 }
      );
    }
    const axios = GetAxiosInstance(req);
    const response = await axios.get<Book[]>(`/google-books?query=${query}`);
    const books = response.data ?? [];
    Logger.info(
      "Successfully fetched google books",
      getUserIdFromRequest(req),
      {
        data: {
          query,
          books,
        },
      }
    );
    let top3BooksWithColors = books.slice(0, 3);
    const restOfBooks = books.slice(3);
    top3BooksWithColors = await setThumbnailColorsToBooks(top3BooksWithColors);
    const booksWithColors = top3BooksWithColors.concat(restOfBooks);

    return NextResponse.json({ result: booksWithColors }, { status: 200 });
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
