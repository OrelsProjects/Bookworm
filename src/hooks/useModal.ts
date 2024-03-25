import { useDispatch } from "react-redux";
import {
  showModal,
  ModalTypes,
  hideModal,
} from "../lib/features/modal/modalSlice";
import { Book } from "../models";
import { BooksListData, SafeBooksListData } from "../models/booksList";
import { BookInList } from "../models/bookInList";

export const useModal = () => {
  const dispatch = useDispatch();

  const onShowModal = (data: any, type: ModalTypes, popLast?: boolean) =>
    dispatch(showModal({ data, type, popLast }));

  const showAddBookToListModal = (data: Book) =>
    onShowModal(data, ModalTypes.ADD_BOOK_TO_LIST);

  const showBookDetailsModal = (data: {
    book?: Book;
    bookInList?: BookInList;
  }) => onShowModal(data, ModalTypes.BOOK_DETAILS);

  const showBookInListDetailsModal = (data: SafeBooksListData) =>
    onShowModal(data, ModalTypes.BOOKS_LIST_DETAILS);

  const showBooksListEditModal = (data?: BooksListData, popLast?: boolean) =>
    onShowModal(data, ModalTypes.BOOKS_LIST_DETAILS_EDIT, popLast);

  const showBooksListModal = (
    data: {
      bookList: SafeBooksListData;
      onBack?: () => void;
    },
    popLast?: boolean
  ) => onShowModal(data, ModalTypes.BOOKS_LIST_DETAILS, popLast);

  const showRegisterModal = () => onShowModal(null, ModalTypes.REGISTER);

  const closeModal = () => dispatch(hideModal());

  return {
    showAddBookToListModal,
    showBookDetailsModal,
    showBookInListDetailsModal,
    showBooksListEditModal,
    showBooksListModal,
    showRegisterModal,
    closeModal,
  };
};
