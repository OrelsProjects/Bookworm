import React, { useMemo } from "react";
import { Skeleton } from "../ui/skeleton";
import { Book } from "../../models";
import { CiCirclePlus as Plus } from "react-icons/ci";
import { CiBookmark as Bookmark } from "react-icons/ci";
import { IoBookmark as BookmarkFill } from "react-icons/io5";
import { IoCheckmarkCircleOutline as Checkmark } from "react-icons/io5";
import { IoCheckmarkCircle as CheckmarkFill } from "react-icons/io5";

import BookThumbnail from "../book/bookThumbnail";
import Title from "../book/bookTitle";
import Authors from "../book/authors";
import BookButtons from "../book/bookButtons";
import { useModal } from "../../hooks/useModal";
import useBook from "../../hooks/useBook";
import { getThumbnailSize } from "../../consts/thumbnail";
import { ReadingStatusEnum } from "../../models/readingStatus";
import { useSelector } from "react-redux";
import { selectAuth } from "../../lib/features/auth/authSlice";

export interface BookComponentProps {
  book: Book;
}

const BookSearchResult: React.FC<BookComponentProps> = ({ book }) => {
  const { user } = useSelector(selectAuth);
  const { showBookDetailsModal } = useModal();
  const { getBookFullData } = useBook();
  const {
    handleAddBookToList,
    updateBookStatusToRead,
    updateBookStatusToToRead,
  } = BookButtons();

  const bookFullData = useMemo(
    () => getBookFullData(book),
    [book, getBookFullData]
  );

  const isBookRead = useMemo(() => {
    const bookData = getBookFullData(book);
    return bookData?.userBook.readingStatusId === ReadingStatusEnum.READ;
  }, [book, getBookFullData]);

  const isBookToRead = useMemo(() => {
    const bookData = getBookFullData(book);
    return bookData?.userBook.readingStatusId === ReadingStatusEnum.TO_READ;
  }, [book, getBookFullData]);

  const CheckmarkIcon = isBookRead ? CheckmarkFill : Checkmark;
  const BookmarkIcon = isBookToRead ? BookmarkFill : Bookmark;

  return (
    <div
      className={`flex flex-row justify-start items-start gap-2 w-full ${
        getThumbnailSize("xs").height
      }`}
      onClick={(e) => {
        e.stopPropagation();
        showBookDetailsModal({ book });
      }}
    >
      <div className="flex-shrink-0">
        <BookThumbnail
          src={book.thumbnailUrl}
          className="rounded-xl !relative"
          thumbnailSize="xs"
        />
      </div>
      <div className="h-full flex flex-col justify-between items-start">
        <div className="flex flex-col">
          <Title title={book.title} />
          <Authors authors={book.authors} prefix="by" />
        </div>
        <div className="w-full h-full flex justify-start items-end gap-6">
          <div
            className="flex flex-col gap-0 text-sm justify-center items-center flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              updateBookStatusToRead(book, bookFullData);
            }}
          >
            <CheckmarkIcon
              className={`text-2xl w-4 h-4 ${
                isBookRead ? "!text-primary" : ""
              }`}
            />
            <div className="leading-4">Read?</div>
          </div>
          <div
            className="flex flex-col gap-0 text-sm justify-center items-center flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              updateBookStatusToToRead(book, bookFullData);
            }}
          >
            <BookmarkIcon
              className={`text-2xl w-4 h-4 ml-1 ${
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
              <Plus className="text-2xl w-4 h-4" />
              <div className="leading-4">Readlist</div>
            </div>
          )}
        </div>
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
    <div className={`flex rounded-lg shadow space-x-4 ${className ?? ""}`}>
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

export default BookSearchResult;
