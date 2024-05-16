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
  loading?: "lazy" | "eager";
}

const ImagePlaceholder = ({
  thumbnailSize,
  className,
}: {
  thumbnailSize: ThumbnailSize;
  className?: string;
}) => (
  <Skeleton
    className={`${getThumbnailSize(thumbnailSize).className} ${
      thumbnailSize === "xs" ? "rounded-[6px]" : "rounded-2xl"
    } ${className ?? ""}`}
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
  loading,
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
      } md:h-fit md:w-fit`}
    >
      {!imageLoaded && !imageError && (
        <ImagePlaceholder thumbnailSize={thumbnailSize} />
      )}
      <img
        src={imageError ? placeholderSrc : thumbnailUrl ?? placeholderSrc}
        alt={`${bookTitle} thumbnail`}
        height={height}
        width={width}
        loading={loading}
        onClick={onClick && book ? () => onClick(book) : undefined}
        className={`${
          thumbnailSize === "xs" ? "rounded-[6px]" : "rounded-2xl"
        } w-full h-full  ${className ?? ""}`}
        onLoad={handleImageLoaded}
        onError={handleImageError}
        style={{ display: imageLoaded ? "block" : "none" }}
      />
      {Icon}
    </div>
  );
};

export default BookThumbnail;
