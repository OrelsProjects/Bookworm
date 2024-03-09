import React from "react";
import { Book } from "../../models";
import { useDispatch } from "react-redux";
import { showModal, ModalTypes } from "../../lib/features/modal/modalSlice";
import BookDetails from "./bookDetails";
import useScrollPosition, {
  ScrollDirection,
} from "../../hooks/useScrollPosition";
import { Add } from "../icons";
import { ThumbnailSize } from "../../consts/thumbnail";

type BookListProps = {
  books: (Book | undefined)[];
  className?: string;
  direction: "row" | "column";
  onNextPageScroll?: () => void;
  bookThumbnailSize?: ThumbnailSize;
  disableScroll?: boolean;
  CustomBookComponent?: React.FC<{ book?: Book }>;
};

const BookList: React.FC<BookListProps> = ({
  books,
  className,
  direction = "row",
  onNextPageScroll,
  bookThumbnailSize,
  disableScroll,
  CustomBookComponent,
}) => {
  const dispatch = useDispatch();
  const { scrollableDivRef } = useScrollPosition({
    onThreshold: () => onNextPageScroll?.(),
    scrollDirection:
      direction === "row" ? ScrollDirection.Width : ScrollDirection.Height,
  });

  const onBookClick = (book?: Book) =>
    dispatch(showModal({ data: book, type: ModalTypes.BOOK_DETAILS }));

  return (
    <div
      className={`flex gap-3 flex-grow scrollbar-hide ${className ?? ""}
      ${direction === "row" ? "flex-row h-fit " : "flex-col h-fit max-h-96"}
      ${disableScroll ? "" : "overflow-auto"}
      `}
      ref={scrollableDivRef}
    >
      {books.map((book) => (
        <div
          onClick={() => onBookClick(book)}
          className="h-full"
          key={`book-in-books-list-${book?.bookId}`}
        >
          {CustomBookComponent ? (
            <CustomBookComponent book={book} />
          ) : (
            <BookDetails
              book={book}
              bookThumbnailSize={bookThumbnailSize}
              ThumbnailIcon={
                direction === "row" && (
                  <div className="relative">
                    <div className="absolute bottom-2 left-2 w-fit h-fit rounded-full overflow-hidden flex items-center justify-center">
                      <Add.Outline
                        className="!text-background !bg-foreground -m-1 border-none"
                        size="md"
                      />
                    </div>
                  </div>
                )
              }
              Icon={
                direction === "column" && (
                  <Add.Outline className="flex-shrink-0" size="md" />
                )
              }
              direction={direction}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default BookList;
