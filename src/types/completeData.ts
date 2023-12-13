import { Book, BookSubGenre, Genre, GoodreadsData, User } from "../models";

export type CompleteBookData = {
  book: Book;
  genres: Genre[];
  subGenres: BookSubGenre[];
  goodreadsData: GoodreadsData;
};

export type CompleteUserBook = {
  completeBook: CompleteBookData;
  user: User;
};
