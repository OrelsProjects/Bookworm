import {
  Book,
  BookSubGenre,
  Genre,
  GoodreadsData,
  User,
  UserBook,
} from "../models";

export type CompleteBookData = {
  book: Book;
  genres: Genre[];
  subGenres: BookSubGenre[];
  goodreadsData: GoodreadsData;
};
export type CompleteUserBooksData = {
  completeBook: CompleteBookData;
  userBookData: UserBook
}
export type UserBooksData = {
  userBooks: CompleteUserBooksData[]
  user: User;
};