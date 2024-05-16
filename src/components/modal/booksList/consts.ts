import { SafeBooksListData } from "../../../models/booksList";

export interface ModalBooksListProps<T extends SafeBooksListData> {
  safeBooksListData?: T;
  className?: string;
  loading?: boolean;
}

export type BooksListViewProps = ModalBooksListProps<SafeBooksListData>;
