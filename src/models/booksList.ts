import { BookInListNoListId, BookInListWithBook } from "./bookInList";

export interface BooksList {
  listId: string;
  userId: string;
  description: string | null;
  publicURL: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  isVisible: boolean;
  publishedAt: Date | null;
  expiresAt: Date | null;
  isDeleted: boolean;
  genres?: string[];
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

export type BooksListData = BooksList & { matchRate?: number } & {
  booksInList: BookInListWithBook[];
} & { curatorName?: string };

export type SafeBooksListData = {
  description: string | null;
  publicURL: string;
  name: string;
  genres?: string[];
  visitCount?: number;
  matchRate?: number;
} & { booksInList: BookInListWithBook[] } & { curatorName?: string };

export const booksListDataToSafeBooksListData = (
  booksListData?: BooksListData
): SafeBooksListData | undefined => {
  if (!booksListData) {
    return undefined;
  }
  const {
    isVisible,
    createdAt,
    updatedAt,
    publishedAt,
    expiresAt,
    ...safeData
  } = booksListData;
  return safeData;
};
