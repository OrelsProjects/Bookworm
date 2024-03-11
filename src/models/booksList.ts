import { BookInListNoListId, BookInListWithBook } from "./bookInList";

export interface BooksList {
  listId: string;
  userId: string;
  description: string | null;
  publicURL: string | null;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  isVisible: boolean;
  publishedAt: Date | null;
  expiresAt: Date | null;
  isDeleted: boolean;
}

export type CreateBooksListPayload = Omit<
  BooksList,
  | "listId"
  | "createdAt"
  | "updatedAt"
  | "isDeleted"
  | "userId"
  | "publicURL"
  | "publishedAt"
  | "expiresAt"
  | "isVisible"
> & { booksInList?: BookInListNoListId[] };

export type CreateBooksListResponse = Omit<
  BooksList,
  "updatedAt" | "isDeleted" | "publicURL"
>;

export type BooksListData = BooksList & {
  booksInList: BookInListWithBook[]
};
