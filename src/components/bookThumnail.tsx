import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React from "react";
import { Book } from "../models";
import { useDispatch } from "react-redux";
import {
  BottomSheetTypes,
  showBottomSheet,
} from "../lib/features/modal/modalSlice";

export interface BookThumbnailProps {
  title?: string;
  src?: string;
  book?: Book;
  height?: number;
  width?: number;
  fill?: boolean;
  placeholder?: PlaceholderValue;
  blurDataURL?: string;
  className?: string;
  onClick?: (book: Book) => void;
}

const BookThumbnail: React.FC<BookThumbnailProps> = ({
  title,
  src,
  book,
  height,
  width,
  fill,
  placeholder,
  blurDataURL,
  className,
  onClick,
}) => {
  const thumbnailUrl = book?.thumbnailUrl ?? src;
  const bookTitle = book?.title ?? title;

  return (
    <img
      src={thumbnailUrl ?? "/thumbnailPlaceholder.png"}
      alt={`${bookTitle} thumbnail`}
      fill={fill}
      height={fill ? undefined : height ?? 64}
      width={fill ? undefined : width ?? 80}
      onClick={onClick && book ? () => onClick(book) : undefined}
      placeholder={placeholder ?? "blur"}
      blurDataURL={blurDataURL ?? "/thumbnailPlaceholder.png"}
      className={`rounded-lg ${className}`}
    />
  );
};

export default BookThumbnail;
