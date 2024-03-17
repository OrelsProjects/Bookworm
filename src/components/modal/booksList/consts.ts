import { BooksListData, SafeBooksListData } from "../../../models/booksList";

export interface ModalBooksListProps<T extends SafeBooksListData> {
  booksListData?: T;
}

export type BooksListViewProps = {
  booksInUsersListsCount?: number;
} & ModalBooksListProps<SafeBooksListData>;
