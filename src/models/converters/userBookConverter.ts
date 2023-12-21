import UserBook from "../userBook";
import UserBookDTO, { GetUserBooksResponseDTO } from "../dto/userBookDTO";
import { BookDTOCompleteData } from "../dto/bookDTO";

export function convertToUserBook(userBookDTO: UserBookDTO): UserBook {
  return new UserBook(
    userBookDTO.book_id,
    userBookDTO.reading_status_id,
    userBookDTO.date_added,
    userBookDTO.is_deleted,
    userBookDTO.user_id,
    userBookDTO.user_book_id,
    userBookDTO.is_favorite,
    userBookDTO.user_rating,
    userBookDTO.user_comments,
    userBookDTO.suggestion_source,
    userBookDTO.reading_start_date,
    userBookDTO.reading_finish_date
  );
}

export function convertBookDTOCompleteDataToUserBookDTO(
  userBookResponseDTO: BookDTOCompleteData,
  userBookDataResponseDTO?: GetUserBooksResponseDTO
) {
  return new UserBookDTO(
    userBookResponseDTO.book.book_id,
    userBookDataResponseDTO?.reading_status.reading_status_id,
    userBookDataResponseDTO?.date_added,
    userBookDataResponseDTO?.is_deleted,
    userBookDataResponseDTO?.user_id,
    userBookDataResponseDTO?.user_book_id,
    userBookDataResponseDTO?.is_favorite,
    userBookDataResponseDTO?.user_rating,
    userBookDataResponseDTO?.user_comments,
    userBookDataResponseDTO?.suggestion_source,
    userBookDataResponseDTO?.reading_start_date,
    userBookDataResponseDTO?.reading_finish_date
  );
}

export function convertToUserBookDTO(userBook: UserBook): UserBookDTO {
  return new UserBookDTO(
    userBook.bookId,
    userBook.readingStatusId,
    userBook.dateAdded,
    userBook.isDeleted,
    userBook.userId,
    userBook.userBookId,
    userBook.isFavorite,
    userBook.userRating,
    userBook.userComments,
    userBook.suggestionSource,
    userBook.readingStartDate,
    userBook.readingFinishDate
  );
}
