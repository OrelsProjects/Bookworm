import { Book } from "@/src/models";
import { CreateBooksResponse } from "@/src/models/book";
import { BookDTO } from "@/src/models/dto";
import {
  CreateBookBody,
  CreateBooksResponseDTO,
} from "@/src/models/dto/bookDTO";
import { IResponse } from "@/src/models/dto/response";
import { GetAxiosInstance } from "@/src/utils/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<IResponse<CreateBooksResponse>>> {
  try {
    const book: Book = await req.json();
    const bookDTO = new BookDTO(book);
    const createBookBody: CreateBookBody = {
      books: [bookDTO],
    };
    createBookBody.books[0].description = "";
    const axios = GetAxiosInstance(req);
    const response = await axios.post<CreateBooksResponseDTO>(
      "/book",
      createBookBody
    );
    const bookDTOsWithIds = response.data ?? {};
    const createBooksResponse = {
      success: bookDTOsWithIds.success?.map((bookDTO) =>
        BookDTO.FromResponse(bookDTO)
      ),
      duplicates: bookDTOsWithIds.duplicates?.map((bookDTO) =>
        BookDTO.FromResponse(bookDTO)
      ),
      failure: bookDTOsWithIds.failure?.map((bookDTO) =>
        BookDTO.FromResponse(bookDTO)
      ),
    };

    return NextResponse.json(
      {
        result: createBooksResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
