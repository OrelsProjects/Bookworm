export type Books = Book[];

export interface Book {
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
}

export const compareBooks = (book1?: Book, book2?: Book): boolean =>
  book1?.isbn10 === book2?.isbn10 || book1?.isbn === book2?.isbn;

export type CreateBooksResponse = {
  success?: Book[];
  duplicates?: Book[];
  failure?: Book[];
};

export default Book;

export type CreateBookBody = {
  books: Omit<Book, "bookId">[];
};