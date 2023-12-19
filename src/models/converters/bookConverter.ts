import Book from "../book";
import BookDTO from "../dto/bookDTO";

export function convertToBook(bookDTO: BookDTO): Book {
  return new Book(
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
}

export function convertToBookDTO(book: Book): BookDTO {
  return new BookDTO(book);
}
