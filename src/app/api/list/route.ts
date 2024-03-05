import { Logger } from "@/src/logger";
import { IResponse } from "@/src/models/dto/response";
import { GetAxiosInstance } from "@/src/utils/apiUtils";
import { NextRequest, NextResponse } from "next/server";
import {
  BooksList,
  BooksListData,
  CreateBooksListPayload,
} from "../../../models/booksList";

export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<BooksListData[]>>> {
  try {
    const axios = GetAxiosInstance(req);
    const response = await axios.get<BooksListData[]>("/lists");
    const bookListData = response.data;
    const result = {
      result: bookListData,
    };
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    Logger.error("Error getting user book lists", {
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
    const response = await axios.post<BooksList>("/lists", createBooksListBody);

    const booksList = response.data;

    return NextResponse.json(
      {
        result: booksList,
      },
      { status: 200 }
    );
  } catch (error: any) {
    Logger.error("Error creating book list", {
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
    const response = await axios.patch<BooksList>(
      "/lists",
      updateBooksListBody
    );
    const booksList: BooksList = response.data;
    return NextResponse.json({ result: booksList }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error updating book list", {
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
    Logger.error("Error deleting user book list", {
      data: {
        listId,
      },
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}
