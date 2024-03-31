import React from "react";
import { Book } from "../../models";
import BookDetails from "./bookDetails";
import useScrollPosition from "../../hooks/useScrollPosition";
import { Add } from "../icons/add";
import { ThumbnailSize } from "../../consts/thumbnail";
import { useModal } from "../../hooks/useModal";
import { AiFillPlusCircle } from "react-icons/ai";
import { getIconSize } from "../../consts/icon";

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
    scrollDirection: direction === "row" ? "width" : "height",
  });

  const onBookClick = (book: Book) => showBookDetailsModal({ bookData: book });
  const onAddBookClick = (book?: Book) => showAddBookToListModal(book as Book);

  return (
    <div
      className={`flex gap-[15px] flex-grow ${className ?? ""} ${
        direction === "row" ? "flex-row h-fit" : "flex-col h-full"
      } ${
        disableScroll
          ? ""
          : direction === "row"
          ? "overflow-x-scroll overflow-y-clip hover:overflow-x-scroll"
          : "overflow-y-auto overflow-x-clip"
      }`}
      ref={scrollableDivRef}
    >
      {books.map((book) => (
        <div
          onClick={() => {
            if (book) {
              onBookClick(book);
            }
          }}
          className="h-fit"
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
                      className="absolute bottom-2 right-2 w-fit h-fit rounded-full overflow-hidden flex items-center justify-center shadow-sm shadow-black"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddBookClick(book);
                      }}
                    >
                      <div className="w-10 h-10 bg-black rounded-full text-2xl flex justify-center items-center">
                        +
                      </div>
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
    </div>
  );
};

export default BookList;
