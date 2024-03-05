import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

import React from "react";
import { Book } from "../../models";
import { Skeleton } from "../skeleton";

export enum IconPosition {
  TopLeft = "topLeft",
  TopRight = "topRight",
  BottomLeft = "bottomLeft",
  BottomRight = "bottomRight",
  Center = "center",
}

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
  iconPosition?: IconPosition;
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
}) => {
  const thumbnailUrl = book?.thumbnailUrl ?? src;
  const bookTitle = book?.title ?? title;

  return (
    <div className="h-full relative flex-shrink-0">
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl ?? "/thumbnailPlaceholder.png"}
          alt={`${bookTitle} thumbnail`}
          height={height}
          width={width}
          onClick={onClick && book ? () => onClick(book) : undefined}
          className={`rounded-lg ${className}`}
        />
      ) : (
        <Skeleton
          className={`rounded-lg h-full w-full ${className}`}
          type="none"
        />
      )}
      {Icon}
    </div>
  );
};

export default BookThumbnail;
