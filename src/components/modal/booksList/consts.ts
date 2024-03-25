import { BooksListData, SafeBooksListData } from "../../../models/booksList";

export interface ModalBooksListProps<T extends SafeBooksListData> {
  safeBooksListData?: T;
}

export type BooksListViewProps = ModalBooksListProps<SafeBooksListData>;
