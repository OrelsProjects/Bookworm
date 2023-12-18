import { Book } from "@/src/models";
import { BookDTO, bookDTOToBook } from "@/src/models/dto/bookDTO";
import { GetAxiosInstance } from "@/src/utils/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const book: Book = await req.json();
    const axios = GetAxiosInstance(req);
    console.log(axios.defaults.baseURL);
    const response = await axios.post<BookDTO>("/book", book);
    const bookDTO = response.data;
    return NextResponse.json({
      result: bookDTOToBook(bookDTO),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({});
  }
}
