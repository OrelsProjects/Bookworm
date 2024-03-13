import { IResponse } from "@/src/models/dto/response";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import { NextRequest, NextResponse } from "next/server";
import {
  BooksList,
  BooksListData,
  CreateBooksListPayload,
  SafeBooksListData,
} from "../../../models/booksList";
import Logger from "../../../utils/loggerServer";
import {
  setThumbnailColorsToBooks,
  setThumbnailColorsToBooksListData,
} from "./_utils/thumbnailUtils";

export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<SafeBooksListData>>> {
  try {
    const listUrl = req.nextUrl.searchParams.get("url") as string;
    const axios = GetAxiosInstance(req);
    const params = new URLSearchParams({
      url: listUrl,
    });
    const response = await axios.get<SafeBooksListData>("/list", {
      params,
    });

    let bookListData = response.data;
    if (!bookListData) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }
    let books = bookListData.booksInList.map((book) => book.book);
    books = await setThumbnailColorsToBooks(books);
    bookListData.booksInList = bookListData.booksInList.map((bookInList, index) => {
      return {
        ...bookInList,
        book: books[index],
      };
    });
    const result = {
      result: bookListData,
    };
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    Logger.error("Error getting user book lists", getUserIdFromRequest(req), {
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let createBooksListBody: CreateBooksListPayload | null = null;
  try {
    createBooksListBody = await req.json();
    const axios = GetAxiosInstance(req);
    const response = await axios.post<BooksListData>(
      "/list",
      createBooksListBody
    );
    const booksList = response.data;

    return NextResponse.json(
      {
        result: booksList,
      },
      { status: 200 }
    );
  } catch (error: any) {
    Logger.error("Error creating book list", getUserIdFromRequest(req), {
      data: {
        createBooksListBody,
      },
      error,
    });
    const statusCode = error.response?.status || 500;
    return NextResponse.json({}, { status: statusCode });
  }
}

export async function PATCH(
  req: NextRequest
): Promise<NextResponse<IResponse<BooksList>>> {
  let updateBooksListBody: BooksList | null = null;
  try {
    updateBooksListBody = await req.json();
    const axios = GetAxiosInstance(req);
    const response = await axios.patch<BooksList>("/list", updateBooksListBody);
    const booksList: BooksList = response.data;
    return NextResponse.json({ result: booksList }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error updating book list", getUserIdFromRequest(req), {
      data: {
        updateBooksListBody,
      },
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest
): Promise<NextResponse<IResponse<void>>> {
  let listId: string | null = null;
  try {
    const url = req.nextUrl;
    listId = url.searchParams.get("listId") as string;
    const axios = GetAxiosInstance(req);
    const urlParams = new URLSearchParams();
    urlParams.append("listId", listId);

    const response = await axios.delete<IResponse<void>>("/lists", {
      params: urlParams,
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    Logger.error("Error deleting user book list", getUserIdFromRequest(req), {
      data: {
        listId,
      },
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}
