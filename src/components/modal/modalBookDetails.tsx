"use client";

import React from "react";

import Book from "../../models/book";
import useBook from "../../hooks/useBook";
import { UserBookData } from "../../models/userBook";
import Rating from "../rating";
import BookButtons from "../book/buttons";
import BookThumbnail from "../book/bookThumbnail";
import { ModalProps } from "./modal";
import { ModalContent } from "./modalContainers";

type ModalBookDetailsProps = {
  book: Book;
} & ModalProps;

const ModalBookDetails: React.FC<ModalBookDetailsProps> = ({
  book,
  ...modalProps
}) => {
  const { getBookFullData, userBooksData } = useBook();
  const [bookData, setBookData] = React.useState<
    UserBookData | null | undefined
  >(null);

  React.useEffect(() => {
    const bookFullData = getBookFullData(book);
    setBookData(bookFullData);
  }, [userBooksData]);

  const BookGeneralDetails = () => (
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
      <div className="w-full flex relative flex-col justify-start gap-1 overflow-auto">
        <div className="text-foreground font-bold text-xl">Summary</div>
        <div className="text-foreground overflow-auto h-full scrollbar-hide font-light shadow-inner">
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

  const ButtonsRow = () => <BookButtons book={book} />;

  return (
    <ModalContent
      thumbnail={<Thumbnail />}
      buttonsRow={<ButtonsRow />}
      thumbnailDetails={<BookGeneralDetails />}
      bottomSection={<Summary />}
      {...modalProps}
    />
  );
};

export default ModalBookDetails;
