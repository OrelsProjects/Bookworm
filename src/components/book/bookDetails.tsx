import React from "react";
import { Book } from "../../models";
import BookThumbnail from "./bookThumbnail";
import ModalAuthors from "./authors";
import ModalTitle from "./bookTitle";
import { ThumbnailSize, getThumbnailSize } from "../../consts/thumbnail";

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
      className={`h-fit flex flex-row ${flexDirection} flex-shrink-0 justify-start gap-2.5 cursor-pointer ${sizeClass} ${
        className ?? ""
      }`}
    >
      <BookThumbnail
        book={book}
        className={`flex-shrink-0 ${thumbnailSize.className}`}
        Icon={ThumbnailIcon}
        thumbnailSize={bookThumbnailSize}
      />
      <div className={`grid gap-1.5 h-full justify-start`}>
        <div className={`flex flex-col h-fit`}>
          <div className="text-sm md:text-xl text-start line-clamp-1 md:font-bold leading-[16px] md:line-clamp-2">
            {book?.title ?? ""}
          </div>
          <ModalAuthors
            authors={book?.authors}
            className="text-sm md:text-base text-primary text-start line-clamp-1"
          />
        </div>
        {direction === "column" && (
          <div className="line-clamp-3 text-sm font-light">
            {book?.description}
          </div>
        )}
      </div>
      <div className="h-full flex justify-center items-center self-center ml-auto z-20 flex-shrink-0">
        {Icon}
      </div>
    </div>
  );
};

export default BookDetails;
