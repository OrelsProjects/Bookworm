export type Books = Book[];

class Book {
  title: string;
  mainGenreId: number;
  bookId: string;
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
    bookId: string,
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

  // Another ocnstructor:
  /**
   * this.title,
      this.authors,
      this.published_date,
      this.page_count,
      this.language,
      this.isbn,
      this.isbn10,
      this.thumbnail_url,
      this.medium_image_url
   */
}

export default Book;
