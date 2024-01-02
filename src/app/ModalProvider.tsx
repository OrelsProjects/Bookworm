"use client";

import {
  ModalState,
  ModalTypes,
  hideModal,
} from "@/src/lib/features/modal/modalSlice";
import { RootState } from "@/src/lib/store";
import { Book } from "@/src/models";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "../components";
import BookDetails from "../components/modals/bookDescription";
import AddBookToBacklog from "../components/modals/addBookToReadList";

interface ProviderProps {
  children?: React.ReactNode;
}

const ModalProvider: React.FC<ProviderProps> = ({ children }) => {
  const { data, type, error }: ModalState = useSelector(
    (state: RootState) => state.modal
  );
  const dispatch = useDispatch();

  const RenderComponent = () => {
    switch (type) {
      case ModalTypes.BOOK_DETAILS:
        return RenderBookDetails(data as Book);
      case ModalTypes.ADD_BOOK_TO_BACKLOG:
        return RenderAddBookToBacklog(data as Book);
      default:
        return null;
    }
  };

  const RenderAddBookToBacklog = (book: Book) => (
    <AddBookToBacklog book={book} />
  );

  const RenderBookDetails = (book: Book) => (
    <BookDetails book={book} className="w-full h-full" />
  );

  return (
    <div className="absolute w-screen h-screen">
      <Modal isOpen={data !== null} onClose={() => dispatch(hideModal())}>
        <RenderComponent />
      </Modal>
    </div>
  );
};

export default ModalProvider;
