import React, { useState } from "react";
import { Book } from "../../models";
import { ThumbnailSize, getThumbnailSize } from "../../consts/thumbnail";
import { Skeleton } from "../ui/skeleton";
import { cn } from "../../../lib/utils";

export interface BookThumbnailProps {
  src?: string;
  book?: Book;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
  blurDataURL?: string;
  Icon?: React.ReactNode;
  loading?: "lazy" | "eager";
  containerClassName?: string;
  thumbnailSize?: ThumbnailSize;
  onClick?: (book: Book) => void;
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
  src,
  book,
  Icon,
  title,
  width,
  height,
  loading,
  onClick,
  className,
  containerClassName,
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
      className={cn(
        `relative flex-shrink-0 h-fit w-fit shadow-md ${
          thumbnailSize === "xs" ? "rounded-[6px]" : "rounded-2xl"
        }`,
        containerClassName
      )}
    >
      {!imageLoaded && !imageError && (
        <ImagePlaceholder thumbnailSize={thumbnailSize} className={className} />
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
        } w-full h-full  ${className ?? ""} ${
          getThumbnailSize(thumbnailSize).className
        }`}
        onLoad={handleImageLoaded}
        onError={handleImageError}
        style={{ display: imageLoaded ? "block" : "none" }}
      />
      {Icon}
    </div>
  );
};

export default BookThumbnail;
