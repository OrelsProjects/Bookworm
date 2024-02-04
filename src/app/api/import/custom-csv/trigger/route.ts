import { IResponse } from "@/src/models/dto/response";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
): Promise<NextResponse<IResponse<{}>>> {
  const body = await req.json();

  return NextResponse.json({}, { status: 200 });
}

type BookEntry = {
  Title: string;
  Author: string;
  AuthorLF: string;
  AdditionalAuthors: string;
  isbn10: string | null;
  isbn: string | null;
  MyRating: string;
  AverageRating: string;
  Publisher: string;
  Binding: string;
  NumberOfPages: string;
  YearPublished: string;
  OriginalPublicationYear: string;
  DateRead: string | null;
  DateAdded: string | null;
  Bookshelves: string;
  BookshelvesWithPositions: string;
  ExclusiveShelf: string;
  MyReview: string;
  Spoiler: string;
  PrivateNotes: string;
  ReadCount: string;
  OwnedCopies: string;
  // ... add other fields as necessary
};

function formatBookData(bookEntries: BookEntry[]): BookEntry[] {
  return bookEntries.map((book) => {
    const formattedBook: BookEntry = {
      ...book,
      Author: book.AuthorLF
        ? book.AuthorLF.split(", ").reverse().join(" ")
        : book.Author,
      isbn10: book.isbn10 || null,
      isbn: book.isbn || null,
      MyRating: book.MyRating || "0", // Assuming '0' means not rated
      DateRead: book.DateRead ? formatDate(book.DateRead) : null,
      DateAdded: formatDate(book.DateAdded ?? ""),
      YearPublished: book.YearPublished || book.OriginalPublicationYear,
      OriginalPublicationYear:
        book.OriginalPublicationYear || book.YearPublished,
    };
    return formattedBook;
  });
}

function formatDate(dateString: string): string | null {
  if (!dateString) return null;
  const dateParts = dateString.split("/").map((part) => part.padStart(2, "0"));
  return dateParts.length === 3
    ? `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`
    : null;
}

// Example usage:
// const formattedBooks = formatBookData(bookData); // bookData is your array of book entries
