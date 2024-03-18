import React, { useMemo } from "react";
import BookThumbnail from "../../book/bookThumbnail";
import { BurgerLines } from "../../icons/burgerLines";
import { BooksListViewProps } from "./consts";
import { useModal } from "../../../hooks/useModal";
import { getThumbnailSize } from "../../../consts/thumbnail";
import BookButtons from "../../book/bookButtons";
import useBook from "../../../hooks/useBook";
import toast from "react-hot-toast";
import { Book } from "../../../models";
import {
  ReadingStatusEnum,
  readingStatusToName,
} from "../../../models/readingStatus";
import { Add } from "../../icons/add";

const BookIcon = (icon: React.ReactNode, className?: string) => (
  <div className={`rounded-full bg-background p-2 ${className}`}>{icon}</div>
);

export default function BooksListGridView({
  booksListData,
  booksInUsersListsCount = 0,
}: BooksListViewProps) {
  const {
    getBookFullData,
    updateBookReadingStatus,
    addUserBook,
    loading,
    userBooksData,
    deleteUserBook,
  } = useBook();
  const { showBookDetailsModal } = useModal();

  const handleUpdateBookReadingStatus = async (
    book: Book,
    status: ReadingStatusEnum
  ) => {
    if (loading.current) return;
    const bookData = getBookFullData(book);
    let promise: Promise<any> | undefined = undefined;
    let loadingMessage = "";
    let successMessage = "";
    let errorMessage = "";
    const readingStatusName = readingStatusToName(status);
    if (
      bookData?.userBook?.readingStatusId &&
      bookData?.userBook?.readingStatusId === status
    ) {
      promise = deleteUserBook(bookData.userBook);
      loadingMessage = `Removing ${book?.title} from list ${readingStatusName}...`;
      successMessage = `${book?.title} removed from list ${readingStatusName}`;
      errorMessage = `Failed to remove ${book?.title} from list ${readingStatusName}`;
    } else {
      if (!bookData) {
        promise = addUserBook({
          book,
          readingStatusId: status as number,
        });
      } else {
        promise = updateBookReadingStatus(bookData.userBook, status);
      }
      loadingMessage = `Adding ${book?.title} to list: ${readingStatusName}...`;
      successMessage = `${book?.title} updated to list: ${readingStatusName}`;
      errorMessage = `Failed to add ${book?.title} to list: ${readingStatusName}`;
    }
    await toast.promise(promise, {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    });
  };

  const isOddNumberOfBooks = useMemo(
    () => (booksListData?.booksInList?.length ?? 0) % 2 === 1,
    [booksListData?.booksInList.length]
  );

  const lastIndexOfBooksInList = useMemo(
    () => (booksListData?.booksInList?.length ?? 1) - 1,
    [booksListData?.booksInList.length]
  );

  return (
    <div className="h-full w-full flex flex-col gap-6 mt-8 pb-2 overflow-auto scrollbar-hide">
      <div className="w-full flex flex-row justify-between">
        <div className="w-fit flex flex-row gap-2">
          <BurgerLines.Fill iconSize="md" className="!text-foreground" />
          <div className="font-bold text-2xl">Book List</div>
        </div>
        <div className="w-fit font-bold text-2xl">
          {booksInUsersListsCount}/{booksListData?.booksInList.length}
        </div>
      </div>
      <div className={`flex flex-wrap justify-around gap-4`}>
        {booksListData?.booksInList.map((bookInList, index) => (
          <div
            key={`book-in-list-${index}`}
            className={`flex flex-col justify-start items-center gap-2 ${
              getThumbnailSize("xl").width
            }
            ${
              isOddNumberOfBooks &&
              index === lastIndexOfBooksInList &&
              "mr-auto"
            }
            `}
            onClick={(e) => {
              e.stopPropagation();
              showBookDetailsModal({
                book: bookInList.book,
                bookInList,
              });
            }}
          >
            <BookThumbnail
              book={bookInList.book}
              thumbnailSize="xl"
              Icon={
                <div className="w-full h-full z-40 absolute top-0">
                  <div className="w-full h-full flex flex-row items-end justify-center gap-6 p-2">
                    <Add.Outline
                      iconSize="sm"
                      className="rounded-full !bg-background"
                      // iconClassName="!text-primary"
                    />
                    <Add.Fill iconSize="sm" />
                  </div>
                </div>
              }
            />
            <div className="w-full">
              <div className="w-full text-lg leading-7 font-bold truncate">
                {bookInList.book.title}
              </div>
              <div className="w-full text-sm text-primary leading-5 truncate">
                {bookInList.book.authors?.join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
