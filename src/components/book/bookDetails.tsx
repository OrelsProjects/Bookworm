import React from "react";
import { Book } from "../../models";
import BookThumbnail from "./bookThumbnail";
import { Add } from "../icons";
import Authors from "./authors";
import Title from "./title";

type BookDetailsProps = {
  book?: Book;
  bookThumbnailSize?: "small" | "medium" | "large";
  Icon?: React.ReactNode;
  ThumbnailIcon?: React.ReactNode;
  direction?: "row" | "column";
  className?: string;
};

const thumbnailSizes = {
  extraSmall: {
    width: "w-10",
    height: "h-16",
  },
  small: {
    width: "w-20",
    height: "h-32",
  },
  medium: {
    width: "w-24",
    height: "h-36",
  },
  large: {
    width: "w-32",
    height: "h-48",
  },
};

const BookDetails: React.FC<BookDetailsProps> = ({
  book,
  bookThumbnailSize = "small",
  Icon,
  ThumbnailIcon,
  className,
  direction,
}) => {
  const thumbnailWidth = thumbnailSizes[bookThumbnailSize].width;
  const thumbnailHeight = thumbnailSizes[bookThumbnailSize].height;
  const flexDirection = direction === "row" ? "flex-col" : "flex-row";
  const sizeClass = direction === "row" ? thumbnailWidth : "w-full";
  return (
    <div
      className={`h-full flex ${flexDirection} flex-shrink-0 justify-start items-start gap-3 ${sizeClass} ${className}`}
    >
      <BookThumbnail
        book={book}
        className={`flex-shrink-0 ${thumbnailWidth} ${thumbnailHeight}`}
        Icon={ThumbnailIcon}
      />
      <div className={`flex flex-col  gap-2 overflow-visible flex-grow`}>
        <div className={`flex flex-col`}>
          <Title title={book?.title ?? ""} className="font-sm" />
          <Authors authors={book?.authors} className="text-primary" />
        </div>
        {direction === "column" && (
          <div className="flex-grow">
            <div className="line-clamp-3 text-sm font-light">
              {book?.description}
            </div>
          </div>
        )}
      </div>
      <div>{Icon}</div>
    </div>
  );
};

export default BookDetails;
