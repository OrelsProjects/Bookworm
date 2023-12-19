import Book from "../book";

export class BookDTO {
  title: string;
  main_genre_id: number;
  book_id: string;
  thumbnail_url?: string;
  subtitle?: string;
  original_date_published?: string;
  number_of_pages?: number;
  medium_image_url?: string;
  language?: string;
  isbn10?: string;
  isbn?: string;
  date_published?: string;
  authors?: string[];

  constructor(book: Book) {
    this.title = book.title;
    this.main_genre_id = book.mainGenreId ?? 0;
    this.book_id = book.bookId;
    this.thumbnail_url = book.thumbnailUrl;
    this.subtitle = book.subtitle;
    this.original_date_published = book.originalDatePublished;
    this.number_of_pages = book.numberOfPages;
    this.medium_image_url = book.mediumImageUrl;
    this.language = book.language;
    this.isbn10 = book.isbn10;
    this.isbn = book.isbn;
    this.date_published = book.datePublished;
    this.authors = book.authors;
  }
}

export const bookDTOToBook = (bookDTO: BookDTO): Book =>
  new Book(
    bookDTO.title,
    bookDTO.main_genre_id,
    bookDTO.book_id,
    bookDTO.thumbnail_url,
    bookDTO.subtitle,
    bookDTO.original_date_published,
    bookDTO.number_of_pages,
    bookDTO.medium_image_url,
    bookDTO.language,
    bookDTO.isbn10,
    bookDTO.isbn,
    bookDTO.date_published,
    bookDTO.authors
  );
