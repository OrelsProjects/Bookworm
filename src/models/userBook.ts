import Book from "./book";
import Genre from "./genre";
import GoodreadsData from "./goodreadsData";
import ReadingStatus from "./readingStatus";

class UserBook {
  bookId: number;
  userBookId: number;
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
    userBookId: number,
    dateAdded?: string,
    readingStatusId?: number,
    isDeleted?: boolean,
    userId?: string,
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

export type BookData = {
  book?: Book;
  mainGenre?: Genre;
  subgenres?: (Genre | undefined)[] | undefined;
};

export class UserBookData {
  userBook: UserBook;
  bookData: BookData;
  goodreadsData?: GoodreadsData | null;
  readingStatus?: ReadingStatus;

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
    isFavorite?: boolean,
    goodreadsData?: GoodreadsData
  ) {
    this.userBook = new UserBook(
      book_data.book.bookId,
      userBookId,
      dateAdded,
      readingStatus.readingStatusId,
      isDeleted,
      userId,
      isFavorite,
      userRating,
      userComments,
      suggestionSource,
      readingStartDate,
      readingFinishDate
    );
    this.bookData = book_data;
    this.readingStatus = readingStatus;
    this.goodreadsData = goodreadsData ?? null;
  }
}

export default UserBook;
