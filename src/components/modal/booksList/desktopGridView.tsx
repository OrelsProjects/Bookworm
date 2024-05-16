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
import BooksListThumbnail from "../../booksList/booksListThumbnail";
import GenresTabs from "../../genresTabs";
import ReadMoreText from "../../readMoreText";
import { motion } from "framer-motion";

export function DesktopBooksListGridViewLoading() {
  const ListThumbnail = () => (
    <div className="w-full flex flex-row justify-start items-center gap-5">
      <Skeleton
        className={`${getThumbnailSize("xl").className} rounded-2xl`}
        type="shimmer"
      />
      <div className="h-full w-full flex flex-col justify-between py-2">
        <div className="w-full h-full flex flex-col gap-2">
          <Skeleton className="w-4/6 h-7 rounded-full" type="shimmer" />
          <Skeleton className="w-2/6 h-7 rounded-full" type="shimmer" />
        </div>
        <div className="w-full flex flex-row gap-4">
          {[1, 2, 3, 4].map(() => (
            <Skeleton className="w-28 h-10 rounded-full" type="shimmer" />
          ))}
        </div>
      </div>
    </div>
  );

  const ListComments = () => (
    <div className="w-full h-fit flex flex-col gap-1">
      <Skeleton className="w-full h-10 rounded-full" />
      <Skeleton className="w-full h-10 rounded-full" />
      <Skeleton className="w-full h-10 rounded-full" />
    </div>
  );
  const BooksInList = () => (
    <div className="w-full h-fit flex flex-col gap-[30px] ">
      <div className="w-72 h-fit flex flex-row justify-between">
        <Skeleton className="w-36 h-10 rounded-full" />
        <Skeleton className="w-20 h-10 rounded-full" />
      </div>
      <div className={`flex flex-wrap gap-14 justify-start`}>
        {[1, 2, 3, 4, 5, 6, 8, 9].map((index) => (
          <div
            key={`book-in-list-${index}`}
            className={`flex flex-col justify-start items-start gap-2 
          ${getThumbnailSize("2xl").width}
          `}
          >
            <Skeleton
              className={`w-full h-full rounded-2xl ${
                getThumbnailSize("2xl").className
              }`}
            />
            <div className="w-full flex flex-col gap-1">
              <Skeleton className="w-full h-3 rounded-full" />
              <Skeleton className="w-[90%] h-3 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full w-full hidden md:flex flex-col gap-5">
      <div className="h-full w-full flex flex-col px-14 py-16 gap-10">
        <ListThumbnail />
        <ListComments />
        <BooksInList />
      </div>
    </div>
  );
}

export default function DesktopBooksListGridView({
  safeBooksListData,
  curator,
  loading,
}: BooksListViewProps & { curator?: string } & { loading?: boolean }) {
  const thumbnailSize = "2xl";
  const {
    addUserBook,
    userBooksData,
    deleteUserBook,
    getBookFullData,
    loading: loadingBook,
    updateBookReadingStatus,
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
    if (loadingBook) return;
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
    return (safeBooksListData as any)?.userId !== undefined;
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

  const ListHeader = () => (
    <div className="w-full flex flex-row items-center justify-start gap-32">
      <div className="w-fit flex flex-row items-center gap-2">
        <BurgerLines.Fill iconSize="sm" className="!text-foreground" />
        <div className="text-2xl flex flex-row gap-1 items-center justify-center">
          Book List
        </div>
      </div>
      {isBooksListOwnedByUser ? (
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
      ) : (
        <div className="text-2xl">
          {booksReadCount}/{sortedBooksInList.length}
        </div>
      )}
    </div>
  );

  const ListComments = () => (
    <div className="w-full h-fit flex flex-col gap-1">
      <ReadMoreText
        className="text-[28px] font-light leading-[42px]"
        text={safeBooksListData?.description}
        maxLines={3}
      />
    </div>
  );

  const ListThumbnail = () => (
    <div className="w-full flex flex-row justify-start items-center gap-5">
      <BooksListThumbnail
        booksInList={safeBooksListData?.booksInList}
        thumbnailSize="xl"
      />
      <div className="h-full w-full flex flex-col justify-between py-2">
        <div className="w-full h-full flex flex-col">
          <span className="text-[32px] font-normal line-clamp-1">
            {safeBooksListData?.name}
          </span>
          <span className="text-[32px] font-normal line-clamp-1 text-muted opacity-70">
            {safeBooksListData?.curatorName}
          </span>
        </div>
        <div className="w-full flex flex-row gap-4">
          {safeBooksListData?.visitCount ? (
            <GenresTabs
              genres={[`${safeBooksListData?.visitCount} views`]}
              take={1}
              itemClassName="font-normal"
            />
          ) : (
            <></>
          )}
          <GenresTabs
            genres={safeBooksListData?.genres ?? []}
            take={3}
            itemClassName="font-normal"
          />
        </div>
      </div>
    </div>
  );

  const Thumbnail = ({ bookInList }: { bookInList: BookInListWithBook }) => (
    <div className="w-full h-full relative overflow-visible">
      <BookThumbnail
        book={bookInList.book}
        thumbnailSize={thumbnailSize}
        loading="eager"
        Icon={
          <div className="w-full h-full md:h-fit absolute z-30 bottom-0 flex flex-row items-end justify-center gap-6 p-2">
            <motion.div
              className="h-fit w-fit p-2 px-2.5 rounded-full bg-background"
              whileHover={{ scale: 1.2 }}
            >
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
            </motion.div>
            <motion.div whileHover={{ scale: 1.2 }}>
              <Checkmark.Fill
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateBookReadingStatus(
                    bookInList.book,
                    ReadingStatusEnum.READ
                  );
                }}
                iconSize="md"
                className={`rounded-full p-1.5 ${
                  isRead[bookInList.book.bookId]
                    ? "!bg-primary !text-background"
                    : "!bg-background !text-foreground"
                }`}
              />
            </motion.div>
          </div>
        }
      />
      <motion.div
        initial={{ scale: 1, opacity: 0.4 }}
        whileHover={{ scale: 1.4, opacity: 1 }}
        style={{ transformOrigin: "bottom" }}
        className="w-full h-full absolute inset-0 z-20 rounded-2xl bg-red-500 cursor-pointer"
      ></motion.div>
    </div>
  );

  const BooksInList = () => (
    <div
      className={`flex flex-wrap justify-between gap-4  md:justify-between md:items-center md:gap-[44px]`}
    >
      {sortedBooksInList.map((bookInList, index) => (
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
          <Thumbnail bookInList={bookInList} />
          <div className="w-full">
            <div className="w-full text-lg leading-7 font-bold line-clamp-1">
              {bookInList.book.title}
            </div>
            <div className="w-full text-sm text-primary leading-5 truncate">
              {bookInList.book.authors?.join(", ")}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full w-full hidden md:flex flex-col gap-5 absolute inset-0 z-20 bg-background pl-72">
      {loading ? (
        <DesktopBooksListGridViewLoading />
      ) : (
        <div className="h-full w-full flex flex-col px-14 py-16 gap-10">
          <ListThumbnail />
          <ListComments />
          <ListHeader />
          <BooksInList />
        </div>
      )}
    </div>
  );
}
