import React from "react";
import { Book } from "../../models";
import BookThumbnail from "./bookThumbnail";
import { Add } from "../icons/add";
import Authors from "./authors";
import Title from "./bookTitle";
import { ThumbnailSize, getThumbnailSize } from "../../consts/thumbnail";
import { useModal } from "../../hooks/useModal";

export type BookDetailsProps = {
  book?: Book;
  bookThumbnailSize?: ThumbnailSize;
  Icon?: React.ReactNode;
  ThumbnailIcon?: React.ReactNode;
  direction?: "row" | "column";
  className?: string;
};

const BookDetails: React.FC<BookDetailsProps> = ({
  book,
  bookThumbnailSize = "md",
  Icon,
  ThumbnailIcon,
  className,
  direction,
}) => {
  // const { showBookDetailsModal } = useModal();
  const thumbnailSize = getThumbnailSize(bookThumbnailSize);
  const flexDirection = direction === "row" ? "flex-col" : "flex-row";
  const sizeClass = direction === "row" ? thumbnailSize.width : "w-full";
  return (
    <div
      className={`h-fit flex ${flexDirection} flex-shrink-0 justify-start items-center gap-2 ${sizeClass} ${
        className ?? ""
      }`}
      onClick={(e) => {
        // e.stopPropagation();
        // showBookDetailsModal({ book });
      }}
    >
      <BookThumbnail
        book={book}
        className={`flex-shrink-0 ${thumbnailSize.className}`}
        Icon={ThumbnailIcon}
        thumbnailSize={bookThumbnailSize}
      />
      <div className={`flex flex-col  gap-2 flex-grow self-start`}>
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
      <div className="h-full flex justify-center items-center z-20">{Icon}</div>
    </div>
  );
};

export default BookDetails;
