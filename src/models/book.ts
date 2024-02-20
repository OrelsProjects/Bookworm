import Genre from "./genre";
import GoodreadsData from "./goodreadsData";

export type Books = Book[];

class Book {
  title: string;
  mainGenreId?: number;
  bookId: number;
  thumbnailUrl?: string;
  thumbnailColor?: string;
  subtitle?: string;
  originalDatePublished?: string;
  numberOfPages?: number;
  mediumImageUrl?: string;
  language?: string;
  isbn10?: string;
  isbn?: string;
  datePublished?: string;
  authors?: string[];
  description?: string;

  constructor(
    title: string,
    mainGenreId: number,
    bookId: number,
    thumbnailUrl?: string,
    subtitle?: string,
    originalDatePublished?: string,
    numberOfPages?: number,
    mediumImageUrl?: string,
    language?: string,
    isbn10?: string,
    isbn?: string,
    datePublished?: string,
    authors?: string[],
    description?: string
  ) {
    this.title = title;
    this.mainGenreId = mainGenreId;
    this.bookId = bookId;
    this.thumbnailUrl = thumbnailUrl === "" ? undefined : thumbnailUrl;
    this.subtitle = subtitle;
    this.originalDatePublished = originalDatePublished;
    this.numberOfPages = numberOfPages;
    this.mediumImageUrl = mediumImageUrl === "" ? undefined : mediumImageUrl;
    this.language = language;
    this.isbn10 = isbn10;
    this.isbn = isbn;
    this.datePublished = datePublished;
    this.authors = authors;
    this.description = description;
  }
}

export const compareBooks = (book1?: Book, book2?: Book): boolean =>
  book1?.isbn10 === book2?.isbn10 || book1?.isbn === book2?.isbn;

export type CreateBooksResponse = {
  success?: Book[];
  duplicates?: Book[];
  failure?: Book[];
};

export type GetBooksResponse = {
  book: Book;
  main_genre?: Genre;
  subgenres?: Genre[];
  goodreads_data?: GoodreadsData;
};

export default Book;
