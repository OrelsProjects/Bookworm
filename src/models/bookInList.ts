export interface BookInList {
  listId: string;
  bookId: number;
  comments?: string | null;
}

export type BookInListNoListId = Omit<BookInList, "listId">;
