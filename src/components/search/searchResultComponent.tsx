import React, { useMemo } from "react";
import { Skeleton } from "../ui/skeleton";
import { Book } from "../../models";
import { CiCirclePlus as Plus } from "react-icons/ci";
import { CiBookmark as Bookmark } from "react-icons/ci";
import { IoBookmark as BookmarkFill } from "react-icons/io5";
import { IoCheckmarkCircleOutline as Checkmark } from "react-icons/io5";
import { IoCheckmarkCircle as CheckmarkFill } from "react-icons/io5";

import BookThumbnail from "../book/bookThumbnail";
import ModalTitle from "../book/bookTitle";
import ModalAuthors from "../book/authors";
import BookButtons from "../book/bookButtons";
import { useModal } from "../../hooks/useModal";
import useBook from "../../hooks/useBook";
import { ReadingStatusEnum } from "../../models/readingStatus";
import { useSelector } from "react-redux";
import { selectAuth } from "../../lib/features/auth/authSlice";
import { SafeBooksListData } from "../../models/booksList";
import BooksListThumbnail from "../booksList/booksListThumbnail";

export interface SearchResultProps {
  book?: Book;
  booksList?: SafeBooksListData;
}

const SearchResultComponent: React.FC<SearchResultProps> = ({
  book,
  booksList,
}) => {
  const { user } = useSelector(selectAuth);
  const { showBookDetailsModal, showBooksListModal } = useModal();
  const { getBookFullData } = useBook();
  const {
    handleAddBookToList,
    updateBookStatusToRead,
    updateBookStatusToToRead,
  } = BookButtons();

  const bookData = useMemo(
    () => (book ? getBookFullData(book) : null),
    [book, getBookFullData]
  );

  const isBookRead = useMemo(() => {
    return bookData?.userBook.readingStatusId === ReadingStatusEnum.READ;
  }, [book, getBookFullData]);

  const isBookToRead = useMemo(() => {
    return bookData?.userBook.readingStatusId === ReadingStatusEnum.TO_READ;
  }, [book, getBookFullData]);

  const CheckmarkIcon = isBookRead ? CheckmarkFill : Checkmark;
  const BookmarkIcon = isBookToRead ? BookmarkFill : Bookmark;

  const Thumbnail = () =>
    book ? (
      <BookThumbnail
        src={book.thumbnailUrl}
        className="rounded-xl !relative"
        thumbnailSize="sm"
      />
    ) : (
      <BooksListThumbnail
        booksInList={booksList?.booksInList || []}
        thumbnailSize="sm"
      />
    );

  const Title = () => (
    <div className="flex flex-grow w-full">
      <div className="text-xl text-foreground text-start line-clamp-1 flex-1">
        {book ? book.title : booksList?.name}
      </div>
    </div>
  );

  const Authors = () =>
    book ? (
      <ModalAuthors authors={book.authors} prefix="by" />
    ) : (
      <ModalAuthors
        authors={booksList?.curatorName ? [booksList.curatorName] : []}
      />
    );

  return (
    <div
      className={`flex flex-row justify-start items-start md:items-center gap-2 w-full md:hover:bg-slate-400/40 cursor-pointer md:rounded-lg md:p-2.5`}
      onClick={(e) => {
        e.stopPropagation();
        if (book) {
          showBookDetailsModal({ bookData: book });
        } else if (booksList) {
          showBooksListModal({ booksList: booksList }, { shallow: true });
        }
      }}
    >
      <div className="flex-shrink-0">
        <Thumbnail />
      </div>
      <div className="h-full flex flex-col justify-between items-start">
        <div className="flex flex-col">
          <Title />
          <Authors />
        </div>
        {book && (
          <div className="w-full h-full flex justify-start items-end gap-6 mt-6">
            <div
              className="flex flex-col gap-0 text-sm justify-center items-center flex-shrink-0 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                updateBookStatusToRead(book, bookData);
              }}
            >
              <CheckmarkIcon
                className={`text-2xl w-5 h-5 ${
                  isBookRead ? "!text-primary" : ""
                }`}
              />
              <div className="leading-4">Read?</div>
            </div>
            <div
              className="flex flex-col gap-0 text-sm justify-center items-center flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                updateBookStatusToToRead(book, bookData);
              }}
            >
              <BookmarkIcon
                className={`text-2xl w-5 h-5 ml-1 ${
                  isBookToRead ? "!text-primary" : ""
                }`}
              />
              <div className="leading-4">To Read</div>
            </div>
            {user && (
              <div
                className="flex flex-col gap-0 text-sm justify-center items-center flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddBookToList(book);
                }}
              >
                <Plus className="text-2xl w-5 h-5" />
                <div className="leading-4">Readlist</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface SearchItemSkeletonProps {
  className?: string;
}

export const SearchItemSkeleton: React.FC<SearchItemSkeletonProps> = ({
  className,
}) => {
  return (
    <div className={`flex rounded-lg space-x-4 ${className ?? ""}`}>
      <Skeleton className="w-16 h-24 rounded-xl" />
      <div className="flex flex-col flex-grow justify-start items-start gap-2 mt-2">
        <Skeleton className="h-2 rounded w-1/2" />
        <Skeleton className="h-2 rounded w-1/3" />
        <div className="flex flex-row gap-4 mt-6">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="w-4 h-4 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SearchResultComponent;
