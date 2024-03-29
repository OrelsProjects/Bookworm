import { useDispatch } from "react-redux";
import {
  showModal,
  ModalTypes,
  hideModal,
  ShowModalOptions,
  clearStack as clearStackAction,
} from "../lib/features/modal/modalSlice";
import { Book } from "../models";
import { BooksListData, SafeBooksListData } from "../models/booksList";
import { BookInList } from "../models/bookInList";

export const useModal = () => {
  const dispatch = useDispatch();

  const onShowModal = (
    data: any,
    type: ModalTypes,
    options?: ShowModalOptions
  ) => dispatch(showModal({ data, type, options }));

  const clearStack = () => dispatch(clearStackAction());

  const showAddBookToListModal = (data: Book) =>
    onShowModal(data, ModalTypes.ADD_BOOK_TO_LIST);

  const showBookDetailsModal = (data: {
    book?: Book;
    bookInList?: BookInList;
  }) => onShowModal(data, ModalTypes.BOOK_DETAILS);

  const showBookInListDetailsModal = (data: SafeBooksListData) =>
    onShowModal(data, ModalTypes.BOOKS_LIST_DETAILS);

  const showBooksListEditModal = (
    data?: BooksListData,
    options?: ShowModalOptions
  ) => onShowModal(data, ModalTypes.BOOKS_LIST_DETAILS_EDIT, options);

  const showBooksListModal = (
    data: {
      bookList: SafeBooksListData;
      onBack?: () => void;
    },
    options?: ShowModalOptions
  ) => onShowModal(data, ModalTypes.BOOKS_LIST_DETAILS, options);

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
    clearStack,
  };
};
