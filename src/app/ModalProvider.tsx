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
      default:
        return null;
    }
  };

  const RenderBookDetails = (book: Book) => (
    <BookDetails book={book} className="w-full h-full" />
  );

  return (
    <>
      <Modal isOpen={data !== null} onClose={() => dispatch(hideModal())}>
        <RenderComponent />
      </Modal>
    </>
  );
};

export default ModalProvider;
