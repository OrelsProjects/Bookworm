import { IResponse } from "@/src/models/dto/response";
import { GetAxiosInstance, getUserIdFromRequest } from "@/src/utils/apiUtils";
import { NextRequest, NextResponse } from "next/server";
import { SafeBooksListData } from "../../../../models/booksList";
import Logger from "../../../../utils/loggerServer";
import { setThumbnailColorsToBooks } from "../_utils/thumbnailUtils";
// import { setThumbnailColorsToSafeBooksInList } from "../_utils/thumbnailUtils";

export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<SafeBooksListData[]>>> {
  try {
    const axios = GetAxiosInstance(req);
    const response = await axios.get<SafeBooksListData[]>(
      "/lists/recommendation"
    );
    let safeBooksListData = response.data;
    for (const bookListData of safeBooksListData) {
      let books = bookListData.booksInList.map((book) => book.book);
      books = await setThumbnailColorsToBooks(books);

      bookListData.booksInList = bookListData.booksInList.map(
        (bookInList, index) => {
          return {
            ...bookInList,
            book: books[index],
          };
        }
      );
    }

    const result = {
      result: safeBooksListData,
    };
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    Logger.error("Error getting user book lists", getUserIdFromRequest(req), {
      error,
    });
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: NextRequest) {}
