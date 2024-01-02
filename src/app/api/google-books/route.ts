import { AxiosError } from "axios";
import { GetAxiosInstance } from "../../../utils/axiosInstance";
import { Book } from "../../../models";
import { BookDTO } from "../../../models/dto";
import { NextRequest, NextResponse } from "next/server";
import DataValidator from "@/src/utils/dataValidator";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const axios = GetAxiosInstance(req);
    const query = url.searchParams.get("query") ?? "";
    if (!query) {
      throw new Error("Missing query parameter");
    }
    const response = await axios.get<BookDTO[]>(`/google-books?query=${query}`);

    const bookDTOs: BookDTO[] | null = DataValidator.validateAndCreate(
      response.data,
      BookDTO.schema.array()
    );

    if (!bookDTOs) {
      console.error("Invalid response from API for get request /google-books");
      return NextResponse.json({}, { status: 500 });
    }

    const books: Book[] = bookDTOs.map((bookDTO) =>
      BookDTO.FromResponse(bookDTO)
    );
    return NextResponse.json({ result: books }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    const axiosError = error as AxiosError;
    console.error("Error fetching data:", axiosError.cause);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
