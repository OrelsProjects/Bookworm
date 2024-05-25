import Book from "./book";
import Genre from "./genre";
import GoodreadsData from "./goodreadsData";
import ReadingStatus, { ReadingStatusEnum } from "./readingStatus";

interface UserBook {
  bookId: number;
  id: number;
  userId: string;
  readingStatusId?: number;
  dateAdded?: string;
  isDeleted?: boolean;
  isFavorite?: boolean;
  userRating?: number;
  userComments?: string;
  suggestionSource?: string;
  readingStartDate?: string;
  readingFinishDate?: string;
}

export const isBookRead = (userBook?: UserBook): boolean =>
  userBook?.readingStatusId === ReadingStatusEnum.READ;

export const isBookToRead = (userBook?: UserBook): boolean =>
  userBook?.readingStatusId === ReadingStatusEnum.TO_READ;

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
  "id" | "userId" | "isDeleted"
>;

export type UpdateUserBookBody = Omit<UserBook, "bookId">;
export type DeleteUserBookBody = {
  userBookId: string;
};

export default UserBook;
