import Book from "./book";
import GoodreadsData from "./goodreadsData";

export interface BookInList {
  listId: string;
  bookId: number;
  comments?: string | null;
}

export type BookInListNoListId = Omit<BookInList, "listId">;

export type BookInListWithBook = BookInList & {
  book: Book;
};

export type BookInListFullData = BookInListWithBook & {
  goodreadsData?: GoodreadsData | null;
};
