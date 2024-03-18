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

  const onShowModal = (data: any, type: ModalTypes) =>
    dispatch(showModal({ data, type }));

  const showAddBookToListModal = (data: Book) =>
    onShowModal(data, ModalTypes.ADD_BOOK_TO_LIST);

  const showBookDetailsModal = (data: {
    book?: Book;
    bookInList?: BookInList;
  }) => onShowModal(data, ModalTypes.BOOK_DETAILS);

  const showBookInListDetailsModal = (data: SafeBooksListData) =>
    onShowModal(data, ModalTypes.BOOKS_LIST_DETAILS);

  const showBooksListEditModal = (data?: BooksListData) =>
    onShowModal(data, ModalTypes.BOOKS_LIST_DETAILS_EDIT);

  const showBooksListModal = (data: {
    bookList: SafeBooksListData;
    onBack?: () => void;
  }) => onShowModal(data, ModalTypes.BOOKS_LIST_DETAILS);

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
