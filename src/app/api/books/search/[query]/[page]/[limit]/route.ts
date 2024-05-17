import Logger from "@/src/utils/loggerServer";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import { NextRequest, NextResponse } from "next/server";
import { Book } from "../../../../../../../models";

type SearchBooksParams = {
  query: string;
  page: number;
  limit: number;
};

export async function GET(
  req: NextRequest,
  { params }: { params: SearchBooksParams }
) {
  let query: string | null = "";
  try {
    query = params.query;
    const { page, limit } = params;
    const axios = GetAxiosInstance(req);
    const response = await axios.get<Book[]>(
      `/google-books?query=${query}&page=${page}&limit=${limit}`
    );
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
