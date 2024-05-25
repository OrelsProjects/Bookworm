import React from "react";
import { Book } from "../../models";
import BookDetails from "./bookDetails";
import useScrollPosition from "../../hooks/useScrollPosition";
import { Add } from "../icons/add";
import { ThumbnailSize } from "../../consts/thumbnail";
import { useModal } from "../../hooks/useModal";
import useBook from "../../hooks/useBook";
import { FaTrashCan } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Logger } from "../../logger";
import useTable from "../../hooks/useTable";
import { ReadStatus } from "../../models/readingStatus";
import { EventTracker } from "../../eventTracker";
import { motion } from "framer-motion";

type BookListProps = {
  books?: Book[];
  showAdd?: boolean;
  className?: string;
  showDelete?: boolean;
  disableScroll?: boolean;
  readStatus?: ReadStatus;
  direction: "row" | "column";
  thumbnailSize?: ThumbnailSize;
  onNextPageScroll?: () => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
  CustomBookComponent?: React.FC<{ book?: Book }>;
};

const List = ({
  books,
  showAdd,
  direction,
  showDelete,
  onBookClick,
  thumbnailSize,
  onAddBookClick,
  onDeleteBookClick,
  CustomBookComponent,
}: {
  books: (Book | undefined)[];
  onBookClick: (book: Book) => void;
  onAddBookClick: (book?: Book) => void;
  onDeleteBookClick: (book: Book) => void;
  CustomBookComponent?: React.FC<{ book?: Book }>;
  thumbnailSize?: ThumbnailSize;
  direction: "row" | "column";
  showDelete?: boolean;
  showAdd?: boolean;
}) =>
  books.map((book) => (
    <div
      onClick={() => {
        if (book) {
          onBookClick(book);
        }
      }}
      className="h-fit cursor-pointer transition-all md:p-2.5 md:hover:bg-slate-400/40 md:hover:rounded-xl"
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
                <motion.div
                  whileHover={{ scale: 1.2 }}
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
                  <div className="w-10 h-10 bg-background first-letter:rounded-full text-2xl flex justify-center items-center">
                    {showDelete && book && <FaTrashCan className="w-3 h-3.5" />}
                    {showAdd && <span>+</span>}
                  </div>
                </motion.div>
              </div>
            )
          }
          Icon={
            direction === "column" && (
              <motion.div
                whileHover={{ scale: 1.2 }}
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
              </motion.div>
            )
          }
          direction={direction}
        />
      )}
    </div>
  ));

const BookList: React.FC<BookListProps> = ({
  books,
  showAdd,
  className,
  readStatus,
  showDelete,
  disableScroll,
  thumbnailSize,
  onNextPageScroll,
  direction = "row",
  CustomBookComponent,
}) => {
  const { userBooks, nextPage } = useTable(readStatus);
  console.log("userBooks", userBooks);
  const { deleteUserBookWithBook } = useBook();
  const { showBookDetailsModal, showAddBookToListModal } = useModal();
  const { scrollableDivRef } = useScrollPosition({
    onThreshold: () => (onNextPageScroll ? onNextPageScroll() : nextPage()),
    scrollDirection: direction === "row" ? "width" : "height",
    timeBetweenScrollCalls: 100,
    lowerThreshold: 60,
    upperThreshold: 95,
  });

  const onBookClick = (book: Book) => showBookDetailsModal({ bookData: book });
  const onDeleteBookClick = async (book: Book) => {
    EventTracker.track("Delete book clicked");
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
      <List
        books={books || userBooks.map((ubd) => ubd.bookData.book)}
        showAdd={showAdd}
        direction={direction}
        showDelete={showDelete}
        onBookClick={onBookClick}
        thumbnailSize={thumbnailSize}
        onAddBookClick={onAddBookClick}
        onDeleteBookClick={onDeleteBookClick}
        CustomBookComponent={CustomBookComponent}
      />
    </div>
  );
};

export default BookList;
