export type Books = Book[];

class Book {
  title: string;
  mainGenreId?: number;
  bookId: number;
  thumbnailUrl?: string;
  subtitle?: string;
  originalDatePublished?: string;
  numberOfPages?: number;
  mediumImageUrl?: string;
  language?: string;
  isbn10?: string;
  isbn?: string;
  datePublished?: string;
  authors?: string[];

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
    authors?: string[]
  ) {
    this.title = title;
    this.mainGenreId = mainGenreId;
    this.bookId = bookId;
    this.thumbnailUrl = thumbnailUrl;
    this.subtitle = subtitle;
    this.originalDatePublished = originalDatePublished;
    this.numberOfPages = numberOfPages;
    this.mediumImageUrl = mediumImageUrl;
    this.language = language;
    this.isbn10 = isbn10;
    this.isbn = isbn;
    this.datePublished = datePublished;
    this.authors = authors;
  }
}

export type CreateBooksResponse = {
  success: Book[];
  duplicates: Book[];
  failure: Book[];
};

export default Book;
