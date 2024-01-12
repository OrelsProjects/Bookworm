import { AxiosError } from "axios";
import { GetAxiosInstance } from "../../../utils/axiosInstance";
import { Book } from "../../../models";
import { BookDTO } from "../../../models/dto";
import { NextRequest, NextResponse } from "next/server";
import { Logger } from "@/src/logger";

export async function GET(req: NextRequest) {
  let query: string | null = "";
  try {
    const url = req.nextUrl;
    query = url.searchParams.get("query") ?? "";
    if (!query) {
      throw new Error("Missing query parameter");
    }
    const axios = GetAxiosInstance(req);
    const response = await axios.get<BookDTO[]>(`/google-books?query=${query}`);
    const bookDTOs: BookDTO[] = response.data ?? [];
    const books: Book[] = bookDTOs.map((bookDTO) =>
      BookDTO.FromResponse(bookDTO)
    );
    return NextResponse.json({ result: books }, { status: 200 });
  } catch (error: any) {
    Logger.error("Error getting google books", {
      data: {
        query,
      },
      error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
