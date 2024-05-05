import React from "react";
import { Book } from "../../models";
import BookDetails from "./bookDetails";
import useScrollPosition from "../../hooks/useScrollPosition";
import { Add } from "../icons/add";
import { ThumbnailSize } from "../../consts/thumbnail";
import { useModal } from "../../hooks/useModal";
import useBook from "../../hooks/useBook";
import { FaTrashCan } from "react-icons/fa6";
import { getIconSize } from "../../consts/icon";
import { cn } from "../../lib/utils";
import { toast } from "react-toastify";
import { Logger } from "../../logger";

type BookListProps = {
  books: (Book | undefined)[];
  className?: string;
  direction: "row" | "column";
  onNextPageScroll?: () => void;
  thumbnailSize?: ThumbnailSize;
  disableScroll?: boolean;
  CustomBookComponent?: React.FC<{ book?: Book }>;
  showDelete?: boolean;
  showAdd?: boolean;
};

const BookList: React.FC<BookListProps> = ({
  books,
  className,
  direction = "row",
  onNextPageScroll,
  thumbnailSize,
  disableScroll,
  CustomBookComponent,
  showDelete,
  showAdd,
}) => {
  const { showBookDetailsModal, showAddBookToListModal } = useModal();
  const { deleteUserBookWithBook } = useBook();
  const { scrollableDivRef } = useScrollPosition({
    onThreshold: () => onNextPageScroll?.(), // TODO: Buggy scrolling. Once fixed, reduce the page size in useTable.ts
    scrollDirection: direction === "row" ? "width" : "height",
  });

  const onBookClick = (book: Book) => showBookDetailsModal({ bookData: book });
  const onDeleteBookClick = async (book: Book) => {
    let toastId = toast.loading("Deleting book...");
    try {
      await deleteUserBookWithBook(book);
      toast.success("Book deleted successfully.");
    } catch (e: any) {
      Logger.error(e);
      toast.error("An error occurred while deleting the book.");
    } finally {
      toast.dismiss(toastId);
    }
  };
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
                        if (book && showDelete) {
                          onDeleteBookClick(book);
                        } else {
                          onAddBookClick(book);
                        }
                      }}
                    >
                      <div className="w-10 h-10 bg-black rounded-full text-2xl flex justify-center items-center">
                        {showDelete && book && (
                          <FaTrashCan className="w-3 h-3.5" />
                        )}
                        {showAdd && <span>+</span>}
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
