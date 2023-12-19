import React from "react";
import Image from "next/image";
import { Button } from "../button";
import { SquareSkeleton, LineSkeleton } from "../skeleton";
import { Book } from "../../models";

interface SearchItemProps {
  book: Book;
  onAddToLibrary: (book: Book) => void;
}

const SearchItem: React.FC<SearchItemProps> = ({ book, onAddToLibrary }) => {
  return (
    <div className="bg-card h-22 rounded-lg text-foreground p-2 flex justify-between items-center shadow-md">
      <div className="flex flex-row justify-start items-center gap-3 w-2/5">
        <div className="flex-shrink-0">
          <Image
            src={book.thumbnailUrl ?? "/noCoverThumbnail.png"}
            alt="Book cover"
            height={72}
            width={48}
            className="rounded-md"
          />
        </div>
        <h2 className="text-xl text-foreground line-clamp-2 flex-grow">
          {book.title}
        </h2>
      </div>

      <div className="flex flex-row gap-8 justify-center items-center">
        <p className="text-primary">by {book.authors?.join(", ")}</p>
        <p className="text-muted">{book.numberOfPages} Pages</p>
        <div className="flex flex-row gap-2">
          <Button
            variant="selected"
            onClick={() => {
              onAddToLibrary(book);
            }}
            className="rounded-full"
          >
            Add to library
          </Button>
          <Button
            variant="outline"
            onClick={() => onAddToLibrary(book)}
            className="rounded-full border-none"
          >
            <div className="flex flex-row gap-1">
              <h2 className="text-primary">Details</h2>
              <Image
                src="/externalLink.png"
                alt="External Link"
                height={16}
                width={16}
              />
            </div>
          </Button>
          {/* Add more buttons as needed */}
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
    <div
      className={`bg-gray-600 flex items-center p-4 rounded-lg shadow space-x-4 ${className}`}
    >
      {/* Thumbnail Skeleton */}
      <SquareSkeleton className="h-14 w-10 rounded" />

      {/* Text Skeletons */}
      <div className="flex flex-col flex-grow justify-center">
        <LineSkeleton className="h-4 rounded w-1/2 mb-2" />
      </div>

      {/* Button Skeletons */}
      <div className="flex flex-row gap-2 items-center">
        <LineSkeleton className="h-4 w-14 rounded-full" />
        <LineSkeleton className="h-4 w-14 rounded-full" />

        <SquareSkeleton className="h-10 w-24 rounded-full" />
        <SquareSkeleton className="h-10 w-24 rounded-full" />
      </div>
    </div>
  );
};

export default SearchItem;
