import { Book } from "../../../../models";
import { BookInListWithBook } from "../../../../models/bookInList";
import { BooksListData, SafeBooksListData } from "../../../../models/booksList";
import { getAverageColor } from "../../_utils/thumbnailUtils";

async function setThumbnailColorsToBooksInList(books: Book[]): Promise<Book[]> {
  const batchSize = 100;
  const booksInListWithColors: Book[] = [];
  for (let i = 0; i < books.length; i += batchSize) {
    const batch = books.slice(i, i + batchSize);
    const colorPromises = batch.map(async (book) => {
      if (!book.thumbnailUrl || book.thumbnailColor) {
        return book;
      }
      const thumbnailColor = await getAverageColor(book.thumbnailUrl);
      return book;
    });

    const newBooksWithColors: Book[] = await Promise.all(colorPromises);
    booksInListWithColors.push(...newBooksWithColors);
  }
  return booksInListWithColors;
}

export async function setThumbnailColorsToBooksListData(
  booksListData: BooksListData[]
): Promise<BooksListData[]> {
  try {
    for (const booksList of booksListData) {
      const books = booksList.booksInList?.map((bookInList) => bookInList.book);
      if (!books) {
        continue;
      }
      const booksWithColors = await setThumbnailColorsToBooksInList(books);
      booksList.booksInList = {
        ...booksList.booksInList,
      };
    }
    return booksListData;
  } catch (error: any) {
    return booksListData;
  }
}

export async function setThumbnailColorsToBooks(
  books: Book[]
): Promise<Book[]> {
  try {
    const batchSize = 100;
    const booksWithColors: Book[] = [];
    for (let i = 0; i < books.length; i += batchSize) {
      const batch = books.slice(i, i + batchSize);
      const colorPromises = batch.map(async (book) => {
        if (!book.thumbnailUrl || book.thumbnailColor) {
          return book;
        }
        const thumbnailColor = await getAverageColor(book.thumbnailUrl);
        book = {
          ...book,
          thumbnailColor,
        };
        return book;
      });

      const newBooksWithColors: Book[] = await Promise.all(colorPromises);
      booksWithColors.push(...newBooksWithColors);
    }
    return books;
  } catch (error: any) {
    return books;
  }
}

export async function setThumbnailColorsToSafeBooksInList(
  safeBooks: SafeBooksListData[]
): Promise<SafeBooksListData[]> {
  for (const safeBook of safeBooks) {
    try {
      safeBook.books = await setThumbnailColorsToBooksInList(
        safeBook.books
      );
    } catch (error: any) {}
  }
  return safeBooks;
}
