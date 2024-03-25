import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import React from "react";
import { Book } from "../../models";
import { ThumbnailSize, getThumbnailSize } from "../../consts/thumbnail";

export interface BookThumbnailProps {
  title?: string;
  src?: string;
  book?: Book;
  height?: number;
  width?: number;
  placeholder?: PlaceholderValue;
  blurDataURL?: string;
  className?: string;
  imageClassName?: string;
  onClick?: (book: Book) => void;
  Icon?: React.ReactNode;
  thumbnailSize?: ThumbnailSize;
}

const BookThumbnail: React.FC<BookThumbnailProps> = ({
  title,
  src,
  book,
  height,
  width,
  placeholder,
  blurDataURL,
  className,
  onClick,
  Icon,
  thumbnailSize = "md",
}) => {
  const thumbnailUrl = book?.thumbnailUrl ?? src;
  const bookTitle = book?.title ?? title;

  return (
    <div
      className={`relative flex-shrink-0 ${
        getThumbnailSize(thumbnailSize).className
      }`}
    >
      <img
        src={thumbnailUrl ?? "/thumbnailPlaceholder.png"}
        alt={`${bookTitle} thumbnail`}
        height={height}
        width={width}
        loading="lazy"
        onClick={onClick && book ? () => onClick(book) : undefined}
        className={`rounded-xl ${className ?? ""} w-full h-full`}
      />

      {Icon}
    </div>
  );
};

export default BookThumbnail;
