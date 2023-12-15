import Book from "../book";

export class BookDTO {
  title: string;
  authors?: string[];
  published_date?: string;
  page_count?: number;
  language?: string;
  isbn?: string;
  isbn10?: string;
  thumbnail_url?: string;
  medium_image_url?: string;

  constructor(
    title: string,
    authors?: string[],
    published_date?: string,
    page_count?: number,
    language?: string,
    isbn?: string,
    isbn10?: string,
    thumbnail_url?: string,
    medium_image_url?: string
  ) {
    this.title = title;
    this.authors = authors;
    this.published_date = published_date;
    this.page_count = page_count;
    this.language = language;
    this.isbn = isbn;
    this.isbn10 = isbn10;
    this.thumbnail_url = thumbnail_url;
    this.medium_image_url = medium_image_url;
  }
}

export const bookDTOToBook = (bookDTO: BookDTO): Book =>
  new Book(
    bookDTO.title,
    0, // mainGenreId
    "", // bookId
    bookDTO.thumbnail_url,
    "", // subtitle
    bookDTO.published_date,
    bookDTO.page_count,
    "", // mediumImageUrl
    bookDTO.language,
    bookDTO.isbn,
    bookDTO.isbn10,
    bookDTO.published_date ?? "", // datePublished
    bookDTO.authors
  );
