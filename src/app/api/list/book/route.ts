import { IResponse } from "@/src/models/dto/response";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import { NextRequest, NextResponse } from "next/server";
import { BooksList } from "../../../../models/booksList";
import { BookInList } from "../../../../models/bookInList";
import Logger from "../../../../utils/loggerServer";

const URL = "/list/book";

export async function POST(req: NextRequest) {
  let createBookInList: { bookId: string; listId: string } | null = null;
  try {
    createBookInList = await req.json();
    const axios = GetAxiosInstance(req);
    const response = await axios.post<BookInList>(URL, createBookInList);

    const bookInList = response.data;

    return NextResponse.json(
      {
        result: bookInList,
      },
      { status: 200 }
    );
  } catch (error: any) {
    Logger.error("Error creating user book", getUserIdFromRequest(req), {
      data: {
        createBookInList,
      },
      error,
    });

    return NextResponse.json({}, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest
): Promise<NextResponse<IResponse<void>>> {
  let bookId: string | null = null;
  let listId: string | null = null;
  try {
    const url = req.nextUrl;
    listId = url.searchParams.get("listId") as string;
    bookId = url.searchParams.get("bookId") as string;
    const axios = GetAxiosInstance(req);
    const urlParams = new URLSearchParams();
    urlParams.append("listId", listId);
    urlParams.append("bookId", bookId);

    const response = await axios.delete<IResponse<void>>(URL, {
      params: urlParams,
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    Logger.error(
      "Error deleting book from list",
      getUserIdFromRequest(req),
      {
        data: {
          listId,
          bookId,
        },
        error,
      }
    );
    return NextResponse.json({}, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  let bookInList: BookInList | null = null;
  try {
    bookInList = await req.json();
    const axios = GetAxiosInstance(req);
    await axios.patch(URL, bookInList);
    return NextResponse.json(bookInList, { status: 200 });
  } catch (error: any) {
    Logger.error("Error updating books list", getUserIdFromRequest(req), {
      data: {
        booksList: bookInList,
      },
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}
