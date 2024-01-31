import Book from "../book";
import Genre from "../genre";
import GoodreadsData from "../goodreadsData";
import ReadingStatus from "../readingStatus";
import UserBook from "../userBook";

export type GetUserBooksResponse = UserBook & {
  bookData: {
    book: Book;
    mainGenre?: Genre;
    subgenres?: Genre[];
    goodreadsData?: GoodreadsData;
  };
  readingStatus: ReadingStatus;
};

export type CreateUserBookBody = Omit<
  UserBook,
  "userBookId" | "userId" | "isDeleted"
>;

export type UpdateUserBookBody = Omit<UserBook, "bookId">;
export type DeleteUserBookBody = {
  userBookId: string;
};
