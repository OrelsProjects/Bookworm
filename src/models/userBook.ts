import Book from "./book";
import Genre from "./genre";
import GoodreadsData from "./goodreadsData";
import ReadingStatus, { ReadingStatusEnum } from "./readingStatus";

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

export const isBookRead = (userBook?: UserBook): boolean =>
  userBook?.readingStatusId === ReadingStatusEnum.READ;

export type BookData = {
  book?: Book;
  mainGenre?: Genre;
  subgenres?: (Genre | undefined)[] | undefined;
};

export interface UserBookData {
  userBook: UserBook;
  bookData: BookData;
  goodreadsData?: GoodreadsData | null;
  readingStatus?: ReadingStatus;
}

export type CreateUserBookBody = Omit<
  UserBook,
  "userBookId" | "userId" | "isDeleted"
>;

export type UpdateUserBookBody = Omit<UserBook, "bookId">;
export type DeleteUserBookBody = {
  userBookId: string;
};

export default UserBook;
