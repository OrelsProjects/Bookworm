import Book from "./book";
import Genre from "./genre";
import ReadingStatus from "./readingStatus";

class UserBook {
  bookId: number;
  userBookId?: number;
  userId?: string;
  readingStatusId?: number;
  dateAdded?: string;
  isDeleted?: boolean;
  isFavorite?: boolean;
  userRating?: number;
  userComments?: string;
  suggestionSource?: string;
  readingStartDate?: string;
  readingFinishDate?: string;

  constructor(
    bookId: number,
    readingStatusId?: number,
    dateAdded?: string,
    isDeleted?: boolean,
    userId?: string,
    userBookId?: number,
    isFavorite?: boolean,
    userRating?: number,
    userComments?: string,
    suggestionSource?: string,
    readingStartDate?: string,
    readingFinishDate?: string
  ) {
    this.userBookId = userBookId;
    this.userId = userId;
    this.bookId = bookId;
    this.readingStatusId = readingStatusId;
    this.dateAdded = dateAdded;
    this.isDeleted = isDeleted;
    this.isFavorite = isFavorite;
    this.userRating = userRating;
    this.userComments = userComments;
    this.suggestionSource = suggestionSource;
    this.readingStartDate = readingStartDate;
    this.readingFinishDate = readingFinishDate;
  }
}
/**
 *  user_book_id: number;
  user_id: string;
  suggestion_source?: string;
  user_comments?: string;
  date_added: string;
  user_rating?: number;
  reading_start_date?: string;
  reading_finish_date?: string;
  is_deleted: boolean;
  is_favorite: boolean;
  book_data: {
    book: BookDTO;
    main_genre?: GenreDTO;
    subgenres?: GenreDTO[];
  };
  reading_status: ReadingStatusDTO;
 */
export class UserBookData {
  userBook: UserBook;
  bookData: {
    book: Book;
    mainGenre?: Genre;
    subgenres?: (Genre | undefined)[] | undefined
  };
  readingStatus: ReadingStatus;

  /**
   * 
   user_book_id: number;
  user_id: string;
  suggestion_source?: string;
  user_comments?: string;
  date_added: string;
  user_rating?: number;
  reading_start_date?: string;
  reading_finish_date?: string;
  is_deleted: boolean;
  is_favorite: boolean;
   */
  constructor(
    book_data: {
      book: Book;
      mainGenre?: Genre;
      subgenres?: (Genre | undefined)[] | undefined;
    },
    readingStatus: ReadingStatus,
    userBookId: number,
    userId: string,
    suggestionSource?: string,
    userComments?: string,
    dateAdded?: string,
    userRating?: number,
    readingStartDate?: string,
    readingFinishDate?: string,
    isDeleted?: boolean,
    isFavorite?: boolean
  ) {
    this.userBook = new UserBook(
      book_data.book.bookId,
      readingStatus.readingStatusId,
      dateAdded,
      isDeleted,
      userId,
      userBookId,
      isFavorite,
      userRating,
      userComments,
      suggestionSource,
      readingStartDate,
      readingFinishDate
    );
    this.bookData = book_data;
    this.readingStatus = readingStatus;
  }
}

export default UserBook;
