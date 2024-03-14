"use client";

import React from "react";

import Book from "../../models/book";
import useBook from "../../hooks/useBook";
import { UserBookData } from "../../models/userBook";
import Rating from "../rating";
import BookButtons from "../book/bookButtons";
import BookThumbnail from "../book/bookThumbnail";
import { ModalProps } from "./modal";
import { ModalContent } from "./modalContainers";
import BookGeneralDetails from "./_components/bookGeneralDetails";

type ModalBookDetailsProps = {
  book: Book;
}

const ModalBookDetails: React.FC<ModalBookDetailsProps> = ({
  book
}) => {
  const { getBookFullData, userBooksData } = useBook();
  const [bookData, setBookData] = React.useState<
    UserBookData | null | undefined
  >(null);

  React.useEffect(() => {
    const bookFullData = getBookFullData(book);
    setBookData(bookFullData);
  }, [userBooksData]);

  const Summary = () =>
    book.description ? (
      <div className="w-full flex relative flex-col justify-start gap-1 overflow-auto">
        <div className="text-foreground font-bold text-xl">Summary</div>
        <div className="text-foreground overflow-auto h-full scrollbar-hide font-thin shadow-inner pb-6">
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
      thumbnailSize="lg"
    />
  );

  const ButtonsRow = () => <BookButtons book={book} iconSize="lg" />;

  return (
    <ModalContent
      thumbnail={<Thumbnail />}
      buttonsRow={<ButtonsRow />}
      thumbnailDetails={
        bookData && <BookGeneralDetails userBookData={bookData} />
      }
      bottomSection={<Summary />}
    />
  );
};

export default ModalBookDetails;
