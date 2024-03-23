import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Book } from "../../models";
import { CiCirclePlus as Plus } from "react-icons/ci";
import { CiBookmark as Bookmark } from "react-icons/ci";
import { IoCheckmarkCircleOutline as Checkmark } from "react-icons/io5";
import { IoCheckmarkCircle as CheckmarkFill } from "react-icons/io5";

import BookThumbnail from "../book/bookThumbnail";
import Title from "../book/bookTitle";
import Authors from "../book/authors";
import BookButtons from "../book/bookButtons";
import { useModal } from "../../hooks/useModal";
import useBook from "../../hooks/useBook";

export interface BookComponentProps {
  book: Book;
}

const BookSearchResult: React.FC<BookComponentProps> = ({ book }) => {
  const { showBookDetailsModal } = useModal();
  const { getBookFullData } = useBook();
  const {
    handleAddBookToList,
    updateBookStatusToRead,
    updateBookStatusToToRead,
  } = BookButtons();
  return (
    <div
      className="flex flex-row justify-start items-start gap-2 h-full"
      onClick={(e) => {
        e.stopPropagation();
        showBookDetailsModal({ book });
      }}
    >
      <div className="flex-shrink-0">
        <BookThumbnail
          src={book.thumbnailUrl}
          className="rounded-xl !relative"
          thumbnailSize="sm"
        />
      </div>
      <div className="h-full flex flex-col justify-between items-start">
        <div className="flex flex-col">
          <Title title={book.title} />
          <Authors authors={book.authors} prefix="by" />
        </div>
        <div className="w-full h-full flex justify-end items-end">
          <CheckmarkFill
            className="text-2xl !text-primary"
            onClick={(e) => {
              e.stopPropagation();
              updateBookStatusToRead(book, getBookFullData(book));
            }}
          />
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
