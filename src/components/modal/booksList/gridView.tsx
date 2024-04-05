import React, { useEffect, useMemo, useState } from "react";
import BookThumbnail from "../../book/bookThumbnail";
import { BurgerLines } from "../../icons/burgerLines";
import { BooksListViewProps } from "./consts";
import { useModal } from "../../../hooks/useModal";
import { getThumbnailSize } from "../../../consts/thumbnail";
import useBook from "../../../hooks/useBook";
import toast from "react-hot-toast";
import { Book } from "../../../models";
import {
  ReadingStatusEnum,
  readingStatusToName,
} from "../../../models/readingStatus";
import { Checkmark } from "../../icons/checkmark";
import { Bookmark } from "../../icons/bookmark";
import { isBookRead } from "../../../models/userBook";
import { ErrorUnauthenticated } from "../../../models/errors/unauthenticatedError";
import SwitchEditMode from "../_components/switchEditMode";
import { BooksListData } from "../../../models/booksList";
import { BookInListWithBook } from "../../../models/bookInList";

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

  const [value, setValue] = useState(4);

  useEffect(() => {
    setValue(3);
    setTimeout(() => {
      console.log(value);
    }, 1000);
    setValue(6);
  }, []);

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

  const booksInUsersList = useMemo(() => {
    const booksInList: Record<number, boolean> = {};
    sortedBooksInList?.map((bookInList) => {
      const bookData = getBookFullData(bookInList.book);
      booksInList[bookInList.book.bookId] = !!bookData;
    });
    return booksInList;
  }, [sortedBooksInList]);

  const isRead = useMemo(() => {
    const booksIsRead: Record<number, boolean> = {};
    safeBooksListData?.booksInList?.forEach((bookInList) => {
      const bookData = getBookFullData(bookInList.book);
      booksIsRead[bookInList.book.bookId] = isBookRead(bookData?.userBook);
    });
    return booksIsRead;
  }, [userBooksData]);

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
    let loadingToast = toast.loading(loadingMessage);
    try {
      await promise;
      toast.success(successMessage);
    } catch (e) {
      if (!(e instanceof ErrorUnauthenticated)) {
        toast.error(errorMessage);
      }
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const isBooksListDataNotSafe = useMemo(() => {
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
    <div className="h-full w-full flex flex-col gap-6 mt-2">
      <div className="w-full flex flex-row items-center justify-between">
        <div className="w-fit flex flex-row items-center gap-2">
          <BurgerLines.Fill iconSize="sm" className="!text-foreground" />
          <div className="font-bold text-xl flex flex-row gap-1 items-center justify-center">
            Book List{" "}
            {safeBooksListData?.booksInList &&
            safeBooksListData.booksInList.length > 0 ? (
              <div className="text-muted font-normal">
                ({safeBooksListData.booksInList.length})
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        {isBooksListDataNotSafe && (
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
                        booksInUsersList[bookInList.book.bookId] &&
                        !isRead[bookInList.book.bookId]
                          ? "!text-priamry"
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
