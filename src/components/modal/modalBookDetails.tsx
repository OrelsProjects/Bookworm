"use client";

import React, { ReactElement } from "react";

import { Add, Bookmark, Checkmark } from "../icons";
import Book from "../../models/book";
import { darkenColor } from "../../utils/thumbnailUtils";
import useBook from "../../hooks/useBook";
import { UserBookData } from "../../models/userBook";
import Rating from "../rating";
import BookButtons from "../book/buttons";
import BookThumbnail from "../book/bookThumbnail";
import Modal, { ModalProps } from "./modal";

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
  const darkenedColor = darkenColor(book.thumbnailColor);

  React.useEffect(() => {
    setBookData(getBookFullData(book));
  }, [book]);

  const ButtonImage = (
    title: string,
    Icon: React.ElementType,
    height?: number,
    width?: number,
    color?: string
  ) => (
    <div className="flex flex-col justify-center items-center gap-2">
      <Icon size={height || width} color={color || darkenedColor} />
      <div className="text-foreground text-lg">{title}</div>
    </div>
  );

  const Buttons = () => (
    <div className="h-24 flex flex-row justify-evenly items-center gap-4">
      {ButtonImage("Read", Add.Fill, 35, 35)}
      {ButtonImage("Wishlist", Bookmark.Fill, 35, 35)}
      {ButtonImage("Add to list", Checkmark.Outline, 35, 35, "white")}
    </div>
  );

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

  const Thumbnail = (): ReactElement => (
    <BookThumbnail
      src={book.thumbnailUrl ?? "/thumbnailPlaceholder.png"}
      book={book}
      className="w-full h-full"
    />
  );

  const ThumbnailAndDetails = () => (
    <div className="w-full flex flex-col items-center justify-center gap-4 absolute">
      <div className="w-full flex flex-row justify-evenly">
        <BookThumbnail
          src={book.thumbnailUrl ?? "/thumbnailPlaceholder.png"}
          book={book}
          className="rounded-lg !w-28 !h-44 !relative flex-shrink-0"
        />
        <BookGeneralDetails book={book} />
      </div>
      <BookButtons book={book} />
      <Summary />
    </div>
  );

  return (
    <Modal
      thumbnail={Thumbnail()}
      buttonsRow={Buttons()}
      thumbnailDetails={BookGeneralDetails({ book })}
      bottomSection={Summary()}
      {...modalProps}
    />
  );
};

export default ModalBookDetails;
