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
  thumbnailSize?: ThumbnailSize;
  disableScroll?: boolean;
  CustomBookComponent?: React.FC<{ book?: Book }>;
};

const BookList: React.FC<BookListProps> = ({
  books,
  className,
  direction = "row",
  onNextPageScroll,
  thumbnailSize,
  disableScroll,
  CustomBookComponent,
}) => {
  const dispatch = useDispatch();
  const { scrollableDivRef } = useScrollPosition({
    // onThreshold: () => onNextPageScroll?.(), // TODO: Buggy scrolling. Once fixed, reduce the page size in useTable.ts
    scrollDirection:
      direction === "row" ? ScrollDirection.Width : ScrollDirection.Height,
  });

  const onBookClick = (book?: Book) =>
    dispatch(showModal({ data: book, type: ModalTypes.BOOK_DETAILS }));

  const onAddBookClick = (book?: Book) =>
    dispatch(showModal({ data: book, type: ModalTypes.ADD_BOOK_TO_LIST }));

  return (
    <div
      className={`flex gap-3 flex-grow scrollbar-hide ${className ?? ""}
      ${direction === "row" ? "flex-row h-fit " : "flex-col h-fit"}
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
              bookThumbnailSize={thumbnailSize}
              ThumbnailIcon={
                direction === "row" && (
                  <div className="relative">
                    <div
                      className="absolute bottom-2 left-2 w-fit h-fit rounded-full overflow-hidden flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddBookClick(book);
                      }}
                    >
                      <Add.Outline
                        className="!text-background !bg-foreground -m-1 border-none"
                        iconSize="lg"
                      />
                    </div>
                  </div>
                )
              }
              Icon={
                direction === "column" && (
                  <div className="h-full justify-self-center">
                    <Add.Outline className="flex-shrink-0" iconSize="md" />
                  </div>
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
