import Book from "../book";
import GenreDTO from "./genreDTO";
import GoodreadsDataDTO from "./goodreadsDataDTO";

export default class BookDTO {
  title: string;
  main_genre_id: number;
  book_id: number;
  thumbnail_url?: string;
  subtitle?: string;
  date_published?: string;
  original_date_published?: string;
  number_of_pages?: number;
  medium_image_url?: string;
  language?: string;
  isbn10?: string;
  isbn?: string;
  authors?: string[];
  description?: string;

  // Edge case where date can be in different formats
  formatDate(dateStr: string | undefined): string {
    if (!dateStr) {
      return "Unknown Date";
    }

    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      // Date is valid, format it to 'YYYY-MM-DD'
      return parsedDate.toISOString().split("T")[0];
    }

    // If the date is in 'YYYY-MM' format, append '-01'
    if (dateStr.length === 7) {
      return `${dateStr}-01`;
    }
    return dateStr;
  }

  constructor(book: Book) {
    this.title = book.title;
    this.main_genre_id = book.mainGenreId ?? 1;
    this.book_id = book.bookId;
    this.thumbnail_url = book.thumbnailUrl;
    this.subtitle = book.subtitle;
    this.date_published = this.formatDate(book.datePublished);
    this.original_date_published = book.originalDatePublished;
    this.number_of_pages = book.numberOfPages;
    this.medium_image_url = book.mediumImageUrl;
    this.language = book.language;
    this.isbn10 = book.isbn10;
    this.isbn = book.isbn;
    this.authors = book.authors;
    this.description = book.description;
  }
  static FromResponse = (bookDTO: BookDTO): Book =>
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
      bookDTO.authors,
      bookDTO.description
    );
}

export type CreateBookBody = {
  books: BookDTO[];
};

export type CreateBooksResponseDTO = {
  success?: BookDTO[];
  duplicates?: BookDTO[];
  failure?: BookDTO[];
};

export type GetBooksResponseDTO = {
  book: BookDTO;
  main_genre?: GenreDTO;
  subgenres?: GenreDTO[];
  goodreads_data?: GoodreadsDataDTO;
};
