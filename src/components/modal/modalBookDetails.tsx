"use client";

import React, { ReactElement } from "react";

import Book from "../../models/book";
import { increaseLuminosity } from "../../utils/thumbnailUtils";
import useBook from "../../hooks/useBook";
import { UserBookData } from "../../models/userBook";
import Rating from "../rating";
import BookButtons from "../book/buttons";
import BookThumbnail from "../book/bookThumbnail";
import Modal, { ModalProps } from "./modal";
import { ModalContent } from "./modalContainers";

type ModalBookDetailsProps = {
  book: Book;
} & ModalProps;

const ModalBookDetails: React.FC<ModalBookDetailsProps> = ({
  book,
  ...modalProps
}) => {
  const { getBookFullData } = useBook();
  const [bookData, setBookData] = React.useState<
    UserBookData | null | undefined
  >(null);

  React.useEffect(() => {
    setBookData(getBookFullData(book));
  }, [book]);

  const BookGeneralDetails = ({ book }: { book: Book }) => (
    <div className="h-full w-full flex flex-col gap-4">
      <div>
        <div className="font text-foreground line-clamp-1 font-bold text-xl pr-2">
          {book.title}
        </div>
        <div className="text-lg text-foreground line-clamp-2">
          {book.authors?.join(", ")}
        </div>
      </div>
      <Rating rating={bookData?.goodreadsData?.goodreadsRating} />
    </div>
  );

  const Summary = () =>
    book.description ? (
      <div className="w-full flex relative flex-col justify-start gap-1 px-8">
        <div className="text-foreground font-bold text-xl">Summary</div>
        <div className="text-foreground overflow-auto h-60 scrollbar-hide font-light shadow-inner">
          {book.description}
        </div>
        <div className="absolute bottom-0 w-full extra-text-shadow"></div>
      </div>
    ) : (
      <></>
    );

  const Thumbnail = () => (
    <BookThumbnail
      src={book.thumbnailUrl ?? "/thumbnailPlaceholder.png"}
      book={book}
      className="w-full h-full"
    />
  );

  return (
    <ModalContent
      thumbnail={<Thumbnail />}
      buttonsRow={<BookButtons book={book} />}
      thumbnailDetails={<BookGeneralDetails book={book} />}
      bottomSection={<Summary />}
      {...modalProps}
    />
  );
};

export default ModalBookDetails;
