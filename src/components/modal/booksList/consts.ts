import { SafeBooksListData } from "../../../models/booksList";

export interface ModalBooksListProps<T extends SafeBooksListData> {
  safeBooksListData?: T;
  loading?: boolean;
}

export type BooksListViewProps = ModalBooksListProps<SafeBooksListData>;
