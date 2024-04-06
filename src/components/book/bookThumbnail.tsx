import React, { useState } from "react";
import { Book } from "../../models";
import { ThumbnailSize, getThumbnailSize } from "../../consts/thumbnail";
import { Skeleton } from "../ui/skeleton";

export interface BookThumbnailProps {
  title?: string;
  src?: string;
  book?: Book;
  height?: number;
  width?: number;
  blurDataURL?: string;
  className?: string;
  imageClassName?: string;
  onClick?: (book: Book) => void;
  Icon?: React.ReactNode;
  thumbnailSize?: ThumbnailSize;
}

const ImagePlaceholder = ({
  thumbnailSize,
}: {
  thumbnailSize: ThumbnailSize;
}) => (
  <Skeleton
    className={`${getThumbnailSize(thumbnailSize).className} ${
      thumbnailSize === "xs" ? "rounded-[6px]" : "rounded-2xl"
    }`}
  />
);

const BookThumbnail: React.FC<BookThumbnailProps> = ({
  title,
  src,
  book,
  height,
  width,
  className,
  onClick,
  Icon,
  thumbnailSize = "md",
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const thumbnailUrl = book?.thumbnailUrl ?? src;
  const bookTitle = book?.title ?? title;
  const placeholderSrc = "/thumbnailPlaceholder.png";

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={`relative flex-shrink-0 ${
        getThumbnailSize(thumbnailSize).className
      }`}
    >
      {!imageLoaded && !imageError && (
        <ImagePlaceholder thumbnailSize={thumbnailSize} />
      )}
      <img
        src={imageError ? placeholderSrc : thumbnailUrl ?? placeholderSrc}
        alt={`${bookTitle} thumbnail`}
        height={height}
        width={width}
        loading="eager"
        onClick={onClick && book ? () => onClick(book) : undefined}
        className={`${
          thumbnailSize === "xs" ? "rounded-[6px]" : "rounded-2xl"
        } ${className ?? ""} w-full h-full`}
        onLoad={handleImageLoaded}
        onError={handleImageError}
        style={{ display: imageLoaded ? "block" : "none" }}
      />

      {Icon}
    </div>
  );
};

export default BookThumbnail;
