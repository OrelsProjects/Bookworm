import React from "react";
import { Book } from "../../models";
import BookDetails from "./bookDetails";
import useScrollPosition, {
  ScrollDirection,
} from "../../hooks/useScrollPosition";
import { Add } from "../icons/add";
import { ThumbnailSize } from "../../consts/thumbnail";
import { useModal } from "../../hooks/useModal";

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
  const { showBookDetailsModal, showAddBookToListModal } = useModal();
  const { scrollableDivRef } = useScrollPosition({
    onThreshold: () => onNextPageScroll?.(), // TODO: Buggy scrolling. Once fixed, reduce the page size in useTable.ts
    scrollDirection:
      direction === "row" ? ScrollDirection.Width : ScrollDirection.Height,
  });

  const onBookClick = (book?: Book) => showBookDetailsModal({ book: book });
  const onAddBookClick = (book?: Book) => showAddBookToListModal(book as Book);

  return (
    <li
      className={`flex gap-3 flex-grow scrollbar-hide ${className ?? ""} ${
        direction === "row" ? "flex-row h-fit" : "flex-col h-full"
      } ${disableScroll ? "" : "overflow-auto"}`}
    >
      {books.map((book) => (
        <div
          onClick={() => onBookClick(book)}
          className="h-fit"
          key={`book-in-books-list-${book?.bookId}`}
          ref={scrollableDivRef}
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
                      className="absolute bottom-2 left-2 w-fit h-fit rounded-full overflow-hidden flex items-center justify-center shadow-sm shadow-black"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddBookClick(book);
                      }}
                    >
                      <Add.Fill
                        className="!text-foreground !bg-background rounded-full p-1.5"
                        iconSize="sm"
                      />
                    </div>
                  </div>
                )
              }
              Icon={
                direction === "column" && (
                  <div
                    className="h-full justify-self-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddBookClick(book);
                    }}
                  >
                    <Add.Fill
                      className="!bg-foreground !text-background rounded-full p-1"
                      iconSize="md"
                    />
                  </div>
                )
              }
              direction={direction}
            />
          )}
        </div>
      ))}
    </li>
  );
};

export default BookList;
