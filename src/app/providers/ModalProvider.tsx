"use client";

import {
  BottomSheetState,
  BottomSheetTypes as ModalTypes,
  hideModal,
} from "@/src/lib/features/modal/modalSlice";
import { RootState } from "@/src/lib/store";
import { Book } from "@/src/models";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalBookDetails from "../../components/modal/modalBookDetails";
import Modal from "../../components/modal/modal";
import ModalBooksList from "../../components/modal/modalBooksList";
import { BooksListData } from "../../models/booksList";
import { darkenColor } from "../../utils/thumbnailUtils";

const ModalProvider: React.FC = () => {
  const { data, type, isOpen }: BottomSheetState = useSelector(
    (state: RootState) => state.modal
  );
  const [modalBackgroundColor, setModalBackgroundColor] = React.useState<
    string | undefined
  >();
  const dispatch = useDispatch();

  const RenderComponent = useCallback(() => {
    switch (type) {
      case ModalTypes.BOOK_DETAILS:
        return RenderBookDetails(data);
      case ModalTypes.BOOKS_LIST_DETAILS:
        return RenderBooksListDetails(data);
      default:
        return null;
    }
  }, [data, type]);

  const RenderBooksListDetails = useCallback(
    (booksListData?: BooksListData) => {
      const firstBook = booksListData?.booksInList?.[0]?.book;
      setModalBackgroundColor(
        darkenColor(firstBook?.thumbnailColor ?? "rgb(255,255,255)")
      );
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

  return (
    isOpen && (
      <Modal
        isOpen={isOpen}
        onClose={() => dispatch(hideModal())}
        backgroundColor={modalBackgroundColor}
      >
        <RenderComponent />
      </Modal>
    )
  );
};

export default ModalProvider;
