"use client";

import {
  ModalState,
  ModalTypes as ModalTypes,
  hideModal,
} from "@/src/lib/features/modal/modalSlice";
import { RootState } from "@/src/lib/store";
import { Book } from "@/src/models";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalBookDetails from "../../components/modal/modalBookDetails";
import Modal from "../../components/modal/modal";
import ModalBooksList from "../../components/modal/modalBooksList";
import { BooksListData } from "../../models/booksList";
import { darkenColor } from "../../utils/thumbnailUtils";
import { useRouter } from "next/navigation";
import ModalAddBookToList from "../../components/modal/modalAddBookToList";

const ModalProvider: React.FC = () => {
  const { data, type, isOpen }: ModalState = useSelector(
    (state: RootState) => state.modal
  );
  const router = useRouter();
  const dispatch = useDispatch();

  const modalBackgroundColor = useMemo<string>((): string => {
    const defaultColor = "rgb(255,255,255)";
    switch (type) {
      case ModalTypes.BOOK_DETAILS || ModalTypes.ADD_BOOK_TO_LIST:
        return darkenColor(data?.thumbnailColor) ?? defaultColor;
      case ModalTypes.BOOKS_LIST_DETAILS:
        const firstBook = data?.booksInList?.[0]?.book;
        return darkenColor(firstBook?.thumbnailColor) ?? defaultColor;
      default:
        return defaultColor;
    }
  }, [data]);

  const RenderBooksListDetails = useCallback(
    (booksListData?: BooksListData) => {
      return <ModalBooksList booksListData={booksListData} />;
    },
    []
  );

  const RenderBookDetails = useCallback(
    (book?: Book) =>
      book && (
        <ModalBookDetails
          book={book}
          isOpen={isOpen}
          onClose={() => dispatch(hideModal())}
          backgroundColor={darkenColor(book?.thumbnailColor)}
        />
      ),
    []
  );

  const RenderAddBookToList = useCallback((book?: Book) => {
    return (
      book && (
        <ModalAddBookToList
          book={book}
          isOpen={isOpen}
          onClose={() => dispatch(hideModal())}
          backgroundColor={darkenColor(book?.thumbnailColor)}
        />
      )
    );
  }, []);

  const RenderComponent = () => {
    switch (type) {
      case ModalTypes.BOOK_DETAILS:
        return RenderBookDetails(data);
      case ModalTypes.BOOKS_LIST_DETAILS:
        return RenderBooksListDetails(data);
      case ModalTypes.ADD_BOOK_TO_LIST:
        return RenderAddBookToList(data);
      default:
        return null;
    }
  };

  const handleOnClose = useCallback(() => {
    dispatch(hideModal());
    // switch (type) {
    //   case ModalTypes.BOOKS_LIST_DETAILS:
    //     router.back();
    //     break;
    // }
  }, []);

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
