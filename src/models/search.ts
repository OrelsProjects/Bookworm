import Book from "./book";
import { SafeBooksListData } from "./booksList";

export type SearchResults = {
  books: Book[];
  lists: SafeBooksListData[];
};
