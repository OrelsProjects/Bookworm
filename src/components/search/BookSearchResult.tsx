import React from "react";
import { Skeleton } from "../skeleton";
import { Book } from "../../models";
import BookThumbnail from "../book/bookThumbnail";
import Title from "../book/bookTitle";
import Authors from "../book/authors";
import BookButtons from "../book/bookButtons";
import { useDispatch } from "react-redux";
import { useModal } from "../../hooks/useModal";

export interface BookComponentProps {
  book: Book;
}

const BookSearchResult: React.FC<BookComponentProps> = ({ book }) => {
  const { showBookDetailsModal } = useModal();
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
        <BookButtons book={book} className="!justify-start mt-4" iconSize="sm" />
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
      {/* Thumbnail Skeleton */}
      <Skeleton className="w-16 h-24 rounded-xl" />

      {/* Text and Buttons Skeletons */}
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
