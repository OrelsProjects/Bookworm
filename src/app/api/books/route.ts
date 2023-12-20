import { Book } from "@/src/models";
import { convertBookDTOCompleteDataToUserBookDTO } from "@/src/models/converters/userBookConverter";
import { UserBookDTO } from "@/src/models/dto";
import BookDTO, {
  BookDTOResponse,
  bookDTOToBook,
} from "@/src/models/dto/bookDTO";
import { GetAxiosInstance } from "@/src/utils/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const books: Book[] = await req.json();
    const bookDTOs = books.map((book) => new BookDTO(book));
    const axios = GetAxiosInstance(req);
    const response = await axios.post<BookDTOResponse>("/book", bookDTOs);
    const bookDTOsWithIds = response.data;
    let booksDTOsToAdd: UserBookDTO[] = [];
    booksDTOsToAdd = booksDTOsToAdd.concat(
      bookDTOsWithIds.success.map((bookDTO) =>
        convertBookDTOCompleteDataToUserBookDTO(bookDTO)
      )
    );
    booksDTOsToAdd = booksDTOsToAdd.concat(
      bookDTOsWithIds.duplicates.map((bookDTO) =>
        convertBookDTOCompleteDataToUserBookDTO(bookDTO)
      )
    );

    if (booksDTOsToAdd.length > 0) {
      await axios.post("/user-book", booksDTOsToAdd[0]); // Fix [0] later
    } else {
      throw new Error("No books were added");
    }
    // TODO: Return a report of lists of all success/duplicates/failures (Create a class for this)
    // const booksResult = bookDTOsWithIds.success.map((bookDTO) => bookDTOToBook(bookDTO));
    return NextResponse.json(
      {
        result: [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
