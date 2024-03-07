import Book from "./book";

export interface BookInList {
  listId: string;
  bookId: number;
  comments?: string | null;
}

export type BookInListNoListId = Omit<BookInList, "listId">;

export type BookInListWithBook = BookInList & { book: Book };
