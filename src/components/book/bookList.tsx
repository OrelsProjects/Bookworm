import React from "react";
import { Book } from "../../models";
import { useDispatch } from "react-redux";
import {
  showModal,
  BottomSheetTypes,
} from "../../lib/features/modal/modalSlice";
import BookDetails from "./bookDetails";
import useScrollPosition, {
  ScrollDirection,
} from "../../hooks/useScrollPosition";
import { Add } from "../icons";

type BookListProps = {
  books: (Book | undefined)[];
  className?: string;
  direction: "row" | "column";
  onNextPageScroll?: () => void;
  bookThumbnailSize?: "small" | "medium" | "large";
};

const BookList: React.FC<BookListProps> = ({
  books,
  className,
  direction = "row",
  onNextPageScroll,
  bookThumbnailSize,
}) => {
  const dispatch = useDispatch();
  const { scrollableDivRef } = useScrollPosition({
    onThreshold: () => onNextPageScroll?.(),
    scrollDirection:
      direction === "row" ? ScrollDirection.Width : ScrollDirection.Height,
  });

  const onBookClick = (book?: Book) =>
    dispatch(showModal({ data: book, type: BottomSheetTypes.BOOK_DETAILS }));

  return (
    <div
      className={`flex gap-3 overflow-auto flex-grow scrollbar-hide ${className}
      ${direction === "row" ? "flex-row h-fit " : "flex-col h-96"}
      `}
      ref={scrollableDivRef}
    >
      {books.map((book) => (
        <div onClick={() => onBookClick(book)} className="h-full">
          <BookDetails
            book={book}
            bookThumbnailSize={bookThumbnailSize}
            ThumbnailIcon={
              direction === "row" && (
                <Add.Outline className="w-8 h-8 absolute bottom-2 left-2 bg-background rounded-full border-none overflow-hidden" />
              )
            }
            Icon={
              direction === "column" && (
                <Add.Outline className="w-8 h-8 flex-shrink-0" />
              )
            }
            direction={direction}
          />
        </div>
      ))}
    </div>
  );
};

export default BookList;
