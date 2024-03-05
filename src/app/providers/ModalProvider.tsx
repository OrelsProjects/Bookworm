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
import { BottomSheet } from "../../components";
import ModalBookDetails from "../../components/modal/modalBookDetails";
import Modal from "../../components/modal/modal";
import ModalBooksList from "../../components/modal/modalBooksList";
import { BooksListData } from "../../models/booksList";
import { darkenColor } from "../../utils/thumbnailUtils";
import { ThumbnailSize } from "../../consts/thumbnail";

type RenderComponentProps = {
  book?: Book;
};

const ModalProvider: React.FC = () => {
  const { data, type, isOpen }: BottomSheetState = useSelector(
    (state: RootState) => state.modal
  );
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

  const RenderBooksListDetails = (booksListData?: BooksListData) => {
    const firstBook = booksListData?.booksInList?.[0];
    return (
      <ModalBooksList
        booksListData={booksListData}
        thumbnailSize={ThumbnailSize.Large}
        isOpen={isOpen}
        onClose={() => dispatch(hideModal())}
        backgroundColor={darkenColor(firstBook?.thumbnailColor)}
      />
    );
  };

  const RenderBookDetails = (book?: Book) =>
    book && (
      <ModalBookDetails
        book={book}
        isOpen={isOpen}
        onClose={() => dispatch(hideModal())}
        backgroundColor={darkenColor(book?.thumbnailColor)}
      />
    );

  return isOpen && <RenderComponent />;
};

export default ModalProvider;
