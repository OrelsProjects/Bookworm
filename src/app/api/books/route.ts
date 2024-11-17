import Logger from "@/utils/loggerServer";
import { GetAxiosInstance, getUserIdFromRequest } from "@/utils/apiUtils";
import { Book } from "@/models";
import { CreateBookBody, CreateBooksResponse } from "@/models/book";
import { IResponse } from "@/models/dto/response";

import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<IResponse<CreateBooksResponse>>> {
  let book: Book | null = null;
  try {
    book = await req.json();
    if (book === null) {
      throw new Error("Missing book object");
    }
    const { bookId, ...bookNoId } = book;
    const createBookBody: CreateBookBody = {
      books: [bookNoId],
    }; 

    const axios = GetAxiosInstance(req);
    const response = await axios.post<CreateBooksResponse>(
      "/books",
      createBookBody
    );
    const booksWithIds: CreateBooksResponse = response.data ?? {};

    return NextResponse.json(
      {
        result: booksWithIds,
      },
      { status: 200 }
    );
  } catch (error: any) {
    Logger.error("Error creating book", getUserIdFromRequest(req), {
      data: {
        book: book,
      },
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}
