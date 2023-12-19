import UserBook from "../userBook";
import UserBookDTO from "../dto/userBookDTO";

export function convertToUserBook(userBookDTO: UserBookDTO): UserBook {
  return new UserBook(
    userBookDTO.user_book_id,
    userBookDTO.user_id,
    userBookDTO.book_id,
    userBookDTO.reading_status_id,
    userBookDTO.date_added,
    userBookDTO.is_deleted,
    userBookDTO.is_favorite,
    userBookDTO.user_rating,
    userBookDTO.user_comments,
    userBookDTO.suggestion_source,
    userBookDTO.reading_start_date,
    userBookDTO.reading_finish_date
  );
}

export function convertToUserBookDTO(userBook: UserBook): UserBookDTO {
  return new UserBookDTO(
    userBook.userBookId,
    userBook.userId,
    userBook.bookId,
    userBook.readingStatusId,
    userBook.dateAdded,
    userBook.isDeleted,
    userBook.isFavorite,
    userBook.userRating,
    userBook.userComments,
    userBook.suggestionSource,
    userBook.readingStartDate,
    userBook.readingFinishDate
  );
}
