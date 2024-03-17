"use client";

import {
  ModalState,
  ModalTypes as ModalTypes,
  hideModal,
} from "@/src/lib/features/modal/modalSlice";
import { RootState } from "@/src/lib/store";
import { Book } from "@/src/models";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalBookDetails from "../../components/modal/modalBookDetails";
import Modal from "../../components/modal/modal";
import { BooksListData } from "../../models/booksList";
import { darkenColor } from "../../utils/thumbnailUtils";
import ModalAddBookToList from "../../components/modal/modalAddBookToList";
import { ModalBooksList } from "../../components/modal/modalBooksList";
import ModalBooksListEdit from "../../components/modal/modalBooksListEdit";
import { usePathname, useRouter } from "next/navigation";

const ModalProvider: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { modalStack }: ModalState = useSelector(
    (state: RootState) => state.modal
  );
  const dispatch = useDispatch();

  useEffect(() => {}, [window.location.href]);

  const isOpen = useMemo<boolean>(() => modalStack.length > 0, [modalStack]);

  const { data, type } = useMemo(
    () => modalStack[modalStack.length - 1] ?? {},
    [modalStack]
  );

  const modalBackgroundColor = useMemo<string>((): string => {
    const defaultColor = "rgb(255,255,255)";
    switch (type) {
      case ModalTypes.BOOK_DETAILS:
        return darkenColor(data?.thumbnailColor) ?? defaultColor;
      case ModalTypes.BOOKS_LIST_DETAILS_EDIT:
      case ModalTypes.BOOKS_LIST_DETAILS:
        const firstBook = data?.booksInList?.[0]?.book;
        return darkenColor(firstBook?.thumbnailColor) ?? defaultColor;
      case ModalTypes.ADD_BOOK_TO_LIST:
        return darkenColor(data?.thumbnailColor) ?? defaultColor;
      default:
        return defaultColor;
    }
  }, [type, data]);

  const RenderBooksListDetails = useCallback(
    (booksListData?: BooksListData) => {
      return <ModalBooksList booksListData={booksListData} />;
    },
    []
  );

  const RenderBooksListDetailsEdit = useCallback(
    (booksListData?: BooksListData) => {
      return <ModalBooksListEdit booksListData={booksListData} />;
    },
    []
  );

  const RenderBookDetails = useCallback(
    (book?: Book) => book && <ModalBookDetails book={book} />,
    []
  );

  const RenderAddBookToList = useCallback((book?: Book) => {
    return book && <ModalAddBookToList book={book} />;
  }, []);

  const RenderComponent = () => {
    switch (type) {
      case ModalTypes.BOOK_DETAILS:
        return RenderBookDetails(data);
      case ModalTypes.BOOKS_LIST_DETAILS:
        return RenderBooksListDetails(data);
      case ModalTypes.BOOKS_LIST_DETAILS_EDIT:
        return RenderBooksListDetailsEdit(data);
      case ModalTypes.ADD_BOOK_TO_LIST:
        return RenderAddBookToList(data);
      default:
        return null;
    }
  };

  const handleOnClose = useCallback(() => {
    dispatch(hideModal());
  }, [pathname, router, dispatch]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => handleOnClose()}
      backgroundColor={modalBackgroundColor}
      key="modal"
    >
      <RenderComponent />
    </Modal>
  );
};

export default ModalProvider;
