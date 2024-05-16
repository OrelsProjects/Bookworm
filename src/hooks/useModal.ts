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
import { useSelector } from "react-redux";
import { AuthStateType, selectAuth } from "../lib/features/auth/authSlice";
import { ModalBookDetailsProps } from "../components/modal/modalBookDetails";
import { useRouter } from "next/navigation";

const modalsThatRequireAuth = [
  ModalTypes.ADD_BOOK_TO_LIST,
  ModalTypes.BOOKS_LIST_DETAILS_EDIT,
];

export const useModal = () => {
  const { state } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const router = useRouter();

  const onShowModal = (
    data: any,
    type: ModalTypes,
    options?: ShowModalOptions
  ) => dispatch(showModal({ data, type, options }));

  const clearStack = () => dispatch(clearStackAction());

  const handleShowModal = (
    data: any,
    type: ModalTypes,
    options?: ShowModalOptions
  ) => {
    if (
      state !== AuthStateType.SIGNED_IN &&
      modalsThatRequireAuth.includes(type)
    ) {
      showRegisterModal();
      return;
    }

    onShowModal(data, type, { ...options });
  };

  const showAddBookToListModal = (data: Book) =>
    handleShowModal(data, ModalTypes.ADD_BOOK_TO_LIST);

  const showBookDetailsModal = (data: ModalBookDetailsProps) =>
    handleShowModal(data, ModalTypes.BOOK_DETAILS);

  const showBookInListDetailsModal = (data: SafeBooksListData) =>
    handleShowModal(data, ModalTypes.BOOKS_LIST_DETAILS);

  const showBooksListEditModal = (
    data?: BooksListData,
    options?: ShowModalOptions
  ) => handleShowModal(data, ModalTypes.BOOKS_LIST_DETAILS_EDIT, options);

  const showBooksListModal = (
    data: { booksList?: SafeBooksListData },
    options?: ShowModalOptions
  ) => {
    handleShowModal(data, ModalTypes.BOOKS_LIST_DETAILS, options);
  };

  const showRegisterModal = () => {
    onShowModal(null, ModalTypes.REGISTER);
  };

  const closeModal = () => dispatch(hideModal());

  return {
    closeModal,
    clearStack,
    showRegisterModal,
    showBooksListModal,
    showBookDetailsModal,
    showAddBookToListModal,
    showBooksListEditModal,
    showBookInListDetailsModal,
  };
};
