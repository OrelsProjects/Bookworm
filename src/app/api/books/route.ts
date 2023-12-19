import { Book } from "@/src/models";
import { BookDTO, bookDTOToBook } from "@/src/models/dto/bookDTO";
import { GetAxiosInstance } from "@/src/utils/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const books: Book[] = await req.json();
    const bookDTOs = books.map((book) => new BookDTO(book));
    const axios = GetAxiosInstance(req);
    const response = await axios.post<BookDTO[]>("/book", bookDTOs);
    const bookDTOsWithIds = response.data;
    const booksWithIds: Book[] = bookDTOsWithIds.map((bookDTO) =>
      bookDTOToBook(bookDTO)
    );
    return NextResponse.json(
      {
        result: booksWithIds,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
