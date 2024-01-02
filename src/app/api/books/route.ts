import { Book } from "@/src/models";
import { CreateBooksResponse } from "@/src/models/book";
import { BookDTO } from "@/src/models/dto";
import {
  CreateBookBody,
  CreateBooksResponseDTO,
  CreateBooksResponseSchema,
} from "@/src/models/dto/bookDTO";
import { IResponse } from "@/src/models/dto/response";
import { GetAxiosInstance } from "@/src/utils/axiosInstance";
import DataValidator from "@/src/utils/dataValidator";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(
  req: NextRequest
): Promise<NextResponse<IResponse<CreateBooksResponse>>> {
  try {
    const book: Book = await req.json();
    const bookDTO = new BookDTO(book);

    if (!DataValidator.validate(bookDTO, BookDTO.schema)) {
      console.error("Invalid request body for post request /books");
      return NextResponse.json(
        {
          result: {
            success: [],
            duplicates: [],
            failure: [],
          },
        },
        { status: 400 }
      );
    }
    
    const createBookBody: CreateBookBody = {
      books: [bookDTO],
    };
    const axios = GetAxiosInstance(req);
    const response = await axios.post<CreateBooksResponseDTO>(
      "/book",
      createBookBody
    );
    const bookDTOsWithIds = response.data;
    if (!DataValidator.validate(bookDTOsWithIds, CreateBooksResponseSchema)) {
      console.error("Invalid response from API for post request /books");
      return NextResponse.json(
        {
          result: {
            success: [],
            duplicates: [],
            failure: [],
          },
        },
        { status: 500 }
      );
    }

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
