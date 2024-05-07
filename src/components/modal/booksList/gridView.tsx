import React, { useEffect, useMemo, useState } from "react";
import BookThumbnail from "../../book/bookThumbnail";
import { BurgerLines } from "../../icons/burgerLines";
import { BooksListViewProps } from "./consts";
import { useModal } from "../../../hooks/useModal";
import { getThumbnailSize } from "../../../consts/thumbnail";
import useBook from "../../../hooks/useBook";
import { toast } from "react-toastify";
import { Book } from "../../../models";
import {
  ReadingStatusEnum,
  readingStatusToName,
} from "../../../models/readingStatus";
import { Checkmark } from "../../icons/checkmark";
import { Bookmark } from "../../icons/bookmark";
import { isBookRead, isBookToRead } from "../../../models/userBook";
import { ErrorUnauthenticated } from "../../../models/errors/unauthenticatedError";
import SwitchEditMode from "../_components/switchEditMode";
import { BooksListData } from "../../../models/booksList";
import { BookInListWithBook } from "../../../models/bookInList";
import { Skeleton } from "../../ui/skeleton";

export function BooksListGridViewLoading() {
  return (
    <div className="h-full w-full flex flex-col gap-5">
      <div className="w-full flex flex-row items-center justify-between">
        <Skeleton className="w-36 h-6 rounded-full" />
      </div>
      <div
        className={`flex flex-wrap justify-between gap-4  lg:justify-between lg:items-center lg:gap-[44px]`}
      >
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div className="lg:w-1/6 lg:flex lg:items-center lg:justify-center">
            <div
              key={`book-in-list-${index}`}
              className={`flex flex-col justify-start items-start gap-2 
            ${getThumbnailSize("3xl").width}
            `}
            >
              <Skeleton
                className={`w-full h-full rounded-2xl ${
                  getThumbnailSize("3xl").className
                }`}
              />
              {/* <BookThumbnail
                thumbnailSize="3xl"
                loading="eager"
                Icon={
                  <div className="w-full h-full z-40 absolute top-0">
                    <div className="w-full h-full flex flex-row items-end justify-center gap-6 p-2">
                      <div className="h-fit w-fit p-2 px-2.5 rounded-full bg-background">
                        <Bookmark.Fill
                          iconSize="xs"
                          className="!text-foreground"
                        />
                      </div>
                      <Checkmark.Fill
                        iconSize="md"
                        className={`rounded-full p-1.5 !bg-background !text-foreground`}
                      />
                    </div>
                  </div>
                }
              /> */}
              <div className="w-full flex flex-col gap-1">
                <Skeleton className="w-full h-3 rounded-full" />
                <Skeleton className="w-[90%] h-3 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BooksListGridView({
  safeBooksListData,
  curator,
}: BooksListViewProps & { curator?: string }) {
  const thumbnailSize = "3xl";
  const {
    getBookFullData,
    updateBookReadingStatus,
    addUserBook,
    loading,
    userBooksData,
    deleteUserBook,
  } = useBook();
  const { showBookDetailsModal, showBooksListEditModal } = useModal();

  const [sortedBooksInList, setSortedBooksInList] = React.useState<
    BookInListWithBook[]
  >([]);

  useEffect(() => {
    const booksInlistSorted = [...(safeBooksListData?.booksInList ?? [])];
    booksInlistSorted.sort((a, b) => {
      return a.position - b.position;
    });
    setSortedBooksInList(booksInlistSorted);
  }, [safeBooksListData]);

  const isRead = useMemo(() => {
    const booksIsRead: Record<number, boolean> = {};
    safeBooksListData?.booksInList?.forEach((bookInList) => {
      const bookData = getBookFullData(bookInList.book);
      booksIsRead[bookInList.book.bookId] = isBookRead(bookData?.userBook);
    });
    return booksIsRead;
  }, [userBooksData]);

  const booksReadCount = useMemo(() => {
    let count = 0;
    sortedBooksInList?.map((bookInList) => {
      const bookData = getBookFullData(bookInList.book);
      if (
        bookData?.bookData.book?.bookId &&
        isRead[bookData?.bookData.book?.bookId]
      ) {
        count++;
      }
    });
    return count;
  }, [sortedBooksInList]);

  const isToRead = useMemo(() => {
    const booksIsRead: Record<number, boolean> = {};
    safeBooksListData?.booksInList?.forEach((bookInList) => {
      const bookData = getBookFullData(bookInList.book);
      booksIsRead[bookInList.book.bookId] = isBookToRead(bookData?.userBook);
    });
    return booksIsRead;
  }, [userBooksData]);

  const handleUpdateBookReadingStatus = async (
    book: Book,
    status: ReadingStatusEnum
  ) => {
    if (loading) return;
    const bookData = getBookFullData(book);
    let updateBookPromise: Promise<any> | undefined = undefined;
    let loadingMessage = "";
    let successMessage = "";
    let errorMessage = "";
    const readingStatusName = readingStatusToName(status);
    if (
      bookData?.userBook?.readingStatusId &&
      bookData?.userBook?.readingStatusId === status
    ) {
      updateBookPromise = deleteUserBook(bookData.userBook);
      loadingMessage = `Removing ${book?.title} from list ${readingStatusName}...`;
      successMessage = `${book?.title} removed from list ${readingStatusName}`;
      errorMessage = `Failed to remove ${book?.title} from list ${readingStatusName}`;
    } else {
      if (!bookData) {
        updateBookPromise = addUserBook({
          book,
          readingStatusId: status as number,
        });
      } else {
        updateBookPromise = updateBookReadingStatus(bookData.userBook, status);
      }
      loadingMessage = `Adding ${book?.title} to list: ${readingStatusName}...`;
      successMessage = `${book?.title} updated to list: ${readingStatusName}`;
      errorMessage = `Failed to add ${book?.title} to list: ${readingStatusName}`;
    }
    let loadingToast = toast.loading(loadingMessage);
    try {
      await updateBookPromise;
      toast.success(successMessage);
    } catch (e) {
      if (!(e instanceof ErrorUnauthenticated)) {
        toast.error(errorMessage);
      }
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const isBooksListOwnedByUser = useMemo(() => {
    return (safeBooksListData as any).userId !== undefined;
  }, [safeBooksListData]);

  const booksListData: BooksListData = useMemo(
    () => safeBooksListData as any as BooksListData,
    [safeBooksListData]
  );

  const isOddNumberOfBooks = useMemo(
    () => (safeBooksListData?.booksInList?.length ?? 0) % 2 === 1,
    [safeBooksListData?.booksInList.length]
  );

  const lastIndexOfBooksInList = useMemo(
    () => (safeBooksListData?.booksInList?.length ?? 1) - 1,
    [safeBooksListData?.booksInList.length]
  );

  return (
    <div className="h-full w-full flex flex-col gap-5">
      <div className="w-full flex flex-row items-center justify-between">
        <div className="w-full flex justify-between">
          <div className="w-fit flex flex-row items-center gap-2">
            <BurgerLines.Fill iconSize="sm" className="!text-foreground" />
            <div className="text-2xl flex flex-row gap-1 items-center justify-center">
              Book List
              {/* {safeBooksListData?.booksInList &&
              safeBooksListData.booksInList.length > 0 ? (
                <div className="text-muted font-normal">
                  ({safeBooksListData.booksInList.length})
                </div>
              ) : (
                ""
              )} */}
            </div>
          </div>
          <div className="text-2xl">
            {booksReadCount}/{sortedBooksInList.length}
          </div>
        </div>
        {isBooksListOwnedByUser && (
          <SwitchEditMode
            safeBooksListData={safeBooksListData}
            onCheckedChange={(checked) => {
              if (!checked) return;
              showBooksListEditModal(booksListData, {
                popLast: true,
                shouldAnimate: false,
              });
            }}
          />
        )}
      </div>
      <div
        className={`flex flex-wrap justify-between gap-4  lg:justify-between lg:items-center lg:gap-[44px]`}
      >
        {sortedBooksInList.map((bookInList, index) => (
          <div className="lg:w-1/6 lg:flex lg:items-center lg:justify-center">
            <div
              key={`book-in-list-${index}`}
              className={`flex flex-col justify-start items-start gap-2 
            ${getThumbnailSize(thumbnailSize).width}
            ${
              isOddNumberOfBooks &&
              index === lastIndexOfBooksInList &&
              "mr-auto"
            }
            `}
              onClick={(e) => {
                e.stopPropagation();
                showBookDetailsModal({
                  bookData: bookInList.book,
                  bookInList,
                  curator,
                });
              }}
            >
              <BookThumbnail
                book={bookInList.book}
                thumbnailSize={thumbnailSize}
                loading="eager"
                Icon={
                  <div className="w-full h-full z-40 absolute top-0">
                    <div className="w-full h-full flex flex-row items-end justify-center gap-6 p-2">
                      <div className="h-fit w-fit p-2 px-2.5 rounded-full bg-background">
                        <Bookmark.Fill
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateBookReadingStatus(
                              bookInList.book,
                              ReadingStatusEnum.TO_READ
                            );
                          }}
                          iconSize="xs"
                          className={`
                      ${
                        isToRead[bookInList.book.bookId]
                          ? "!text-primary"
                          : "!text-foreground"
                      }
                      `}
                        />
                      </div>
                      <Checkmark.Fill
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateBookReadingStatus(
                            bookInList.book,
                            ReadingStatusEnum.READ
                          );
                        }}
                        iconSize="md"
                        className={`rounded-full p-1.5
                      ${
                        isRead[bookInList.book.bookId]
                          ? "!bg-primary !text-background"
                          : "!bg-background !text-foreground"
                      }
                      `}
                      />
                    </div>
                  </div>
                }
              />
              <div className="w-full">
                <div className="w-full text-lg leading-7 font-bold line-clamp-1">
                  {bookInList.book.title}
                </div>
                <div className="w-full text-sm text-primary leading-5 truncate">
                  {bookInList.book.authors?.join(", ")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
