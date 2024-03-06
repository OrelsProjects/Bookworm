import React from "react";
import { Book } from "../../models";
import BookThumbnail from "./bookThumbnail";
import { Add } from "../icons";
import Authors from "./authors";
import Title from "./title";
import { ThumbnailSize, getThumbnailSize } from "../../consts/thumbnail";

type BookDetailsProps = {
  book?: Book;
  bookThumbnailSize?: ThumbnailSize;
  Icon?: React.ReactNode;
  ThumbnailIcon?: React.ReactNode;
  direction?: "row" | "column";
  className?: string;
};

const BookDetails: React.FC<BookDetailsProps> = ({
  book,
  bookThumbnailSize = ThumbnailSize.Medium,
  Icon,
  ThumbnailIcon,
  className,
  direction,
}) => {
  const thumbnailSize = getThumbnailSize(bookThumbnailSize);
  const flexDirection = direction === "row" ? "flex-col" : "flex-row";
  const sizeClass = direction === "row" ? thumbnailSize.width : "w-full";
  return (
    <div
      className={`h-fit flex ${flexDirection} flex-shrink-0 justify-start items-start gap-2 ${sizeClass} ${className}`}
    >
      <BookThumbnail
        book={book}
        className={`flex-shrink-0 ${thumbnailSize.className}`}
        Icon={ThumbnailIcon}
      />
      <div className={`flex flex-col  gap-2 overflow-visible flex-grow`}>
        <div className={`flex flex-col -gap-1`}>
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
      <div className="h-full flex justify-center items-center">{Icon}</div>
    </div>
  );
};

export default BookDetails;
