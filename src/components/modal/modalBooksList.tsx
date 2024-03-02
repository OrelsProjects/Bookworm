import React from "react";
import { BooksListData } from "../../models/booksList";
import Modal, { ModalProps } from "./modal";
import BooksListThumbnail from "../BooksListList/booksListThumbnail";

interface ModalBooksListProps {
  booksListData?: BooksListData;
  className?: string;
}

const ModalBooksList: React.FC<ModalBooksListProps & ModalProps> = ({
  booksListData,
  className,
  ...modalProps
}) => {
  const Thumbnail = () => (
    <BooksListThumbnail books={booksListData?.booksInList ?? []} />
  );

  return (
    <Modal
      thumbnail={Thumbnail()}
      {...modalProps}
      backgroundColor={modalProps.backgroundColor || "#B1B1B1"}
    />
  );
};

export default ModalBooksList;
